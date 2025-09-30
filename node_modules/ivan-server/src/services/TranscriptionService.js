// server/services/TranscriptionService.js
import { SpeechClient } from '@google-cloud/speech';
import { OpenAI } from 'openai';
import Bull from 'bull';

export class TranscriptionService {
  constructor() {
    this.speechClient = new SpeechClient();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.transcriptionQueue = new Bull('transcription', {
      redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
      },
    });
    this.setupQueueProcessors();
  }

  setupQueueProcessors() {
    this.transcriptionQueue.process('transcribe', async (job) => {
      const { audioBuffer, channelId, userId } = job.data;
      return await this.transcribeAudio(audioBuffer, channelId, userId);
    });

    this.transcriptionQueue.process('summarize', async (job) => {
      const { transcript, channelId } = job.data;
      return await this.generateSummary(transcript, channelId);
    });
  }

  async startTranscription(channelId, options = {}) {
    const transcription = new VoiceTranscription(channelId, {
      language: options.language || 'en-US',
      punctuation: options.punctuation !== false,
      profanityFilter: options.profanityFilter !== false,
      speakerDiarization: options.speakerDiarization !== false,
      maxSpeakers: options.maxSpeakers || 10,
    });

    await transcription.start();
    return transcription;
  }

  async transcribeAudio(audioBuffer, channelId, userId) {
    const request = {
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        enableSpeakerDiarization: true,
        diarizationConfig: {
          enableSpeakerDiarization: true,
          minSpeakerCount: 2,
          maxSpeakerCount: 10,
        },
        model: 'latest_long',
      },
      audio: {
        content: audioBuffer.toString('base64'),
      },
    };

    try {
      const [response] = await this.speechClient.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join(' ');

      // Store transcription
      await this.storeTranscription(channelId, userId, transcription);

      return {
        text: transcription,
        confidence: response.results[0]?.alternatives[0]?.confidence || 0,
        words: response.results[0]?.alternatives[0]?.words || [],
      };
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  async generateSummary(transcript, channelId) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise summaries of voice chat conversations. Focus on key points, decisions made, and action items.',
          },
          {
            role: 'user',
            content: `Please summarize this voice chat transcript:\n\n${transcript}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      const summary = completion.choices[0].message.content;

      // Extract key points and action items
      const keyPoints = await this.extractKeyPoints(summary);
      const actionItems = await this.extractActionItems(summary);

      return {
        summary,
        keyPoints,
        actionItems,
        timestamp: new Date(),
        channelId,
      };
    } catch (error) {
      console.error('Summary generation error:', error);
      throw error;
    }
  }

  async extractKeyPoints(text) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Extract 3-5 key points from the text. Return as a JSON array of strings.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.2,
    });

    try {
      return JSON.parse(completion.choices[0].message.content);
    } catch {
      return [];
    }
  }

  async extractActionItems(text) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Extract action items from the text. Return as a JSON array with format: [{task: string, assignee?: string}]',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.2,
    });

    try {
      return JSON.parse(completion.choices[0].message.content);
    } catch {
      return [];
    }
  }

  async storeTranscription(channelId, userId, text) {
    const transcription = new Transcription({
      channel: channelId,
      speaker: userId,
      text,
      timestamp: new Date(),
    });
    await transcription.save();
  }

  async getTranscript(channelId, startTime, endTime) {
    const transcriptions = await Transcription.find({
      channel: channelId,
      timestamp: {
        $gte: startTime,
        $lte: endTime,
      },
    }).sort({ timestamp: 1 });

    return this.formatTranscript(transcriptions);
  }

  formatTranscript(transcriptions) {
    return transcriptions.map(t => ({
      speaker: t.speaker,
      text: t.text,
      timestamp: t.timestamp,
    }));
  }
}

class VoiceTranscription extends EventEmitter {
  constructor(channelId, options) {
    super();
    this.channelId = channelId;
    this.options = options;
    this.audioStream = null;
    this.recognizeStream = null;
    this.isActive = false;
  }

  async start() {
    this.isActive = true;
    this.recognizeStream = speechClient
      .streamingRecognize(this.getStreamingConfig())
      .on('data', (data) => this.handleTranscriptionData(data))
      .on('error', (error) => this.handleError(error));
  }

  getStreamingConfig() {
    return {
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: this.options.language,
        enableAutomaticPunctuation: this.options.punctuation,
        profanityFilter: this.options.profanityFilter,
        enableSpeakerDiarization: this.options.speakerDiarization,
        diarizationConfig: {
          enableSpeakerDiarization: this.options.speakerDiarization,
          maxSpeakerCount: this.options.maxSpeakers,
        },
      },
      interimResults: true,
    };
  }

  handleTranscriptionData(data) {
    if (data.results[0] && data.results[0].alternatives[0]) {
      const transcript = data.results[0].alternatives[0].transcript;
      const isFinal = data.results[0].isFinal;

      this.emit('transcription', {
        text: transcript,
        isFinal,
        speaker: data.results[0].speakerTag,
        confidence: data.results[0].alternatives[0].confidence,
      });

      if (isFinal) {
        this.storeTranscription(transcript, data.results[0].speakerTag);
      }
    }
  }

  handleError(error) {
    console.error('Transcription stream error:', error);
    this.emit('error', error);
    this.restart();
  }

  async restart() {
    if (!this.isActive) return;
    
    await this.stop();
    setTimeout(() => this.start(), 1000);
  }

  async stop() {
    this.isActive = false;
    if (this.recognizeStream) {
      this.recognizeStream.end();
      this.recognizeStream = null;
    }
  }
}