import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as Tone from 'tone';
import styles from './SpatialAudio.module.css';

const SpatialAudio = ({
  participants,
  localUserId,
  remoteStreams,
  onPositionChange,
  roomSize = { width: 800, height: 600 },
  enabled = true
}) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const pannerNodesRef = useRef({});
  const listenerRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Local state
  const [positions, setPositions] = useState({});
  const [isDragging, setIsDragging] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [audioVisualization, setAudioVisualization] = useState({});
  
  // Initialize Web Audio API
  useEffect(() => {
    if (!enabled) return;
    
    // Create audio context
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const audioContext = audioContextRef.current;
    
    // Create listener (represents the local user)
    listenerRef.current = audioContext.listener;
    
    // Set up 3D audio space
    if (listenerRef.current.positionX) {
      // New API
      listenerRef.current.positionX.value = 0;
      listenerRef.current.positionY.value = 0;
      listenerRef.current.positionZ.value = 0;
      listenerRef.current.forwardX.value = 0;
      listenerRef.current.forwardY.value = 0;
      listenerRef.current.forwardZ.value = -1;
      listenerRef.current.upX.value = 0;
      listenerRef.current.upY.value = 1;
      listenerRef.current.upZ.value = 0;
    } else {
      // Legacy API
      listenerRef.current.setPosition(0, 0, 0);
      listenerRef.current.setOrientation(0, 0, -1, 0, 1, 0);
    }
    
    return () => {
      // Clean up audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [enabled]);
  
  // Initialize participant positions
  useEffect(() => {
    const newPositions = {};
    const angleStep = (2 * Math.PI) / participants.length;
    
    participants.forEach((participant, index) => {
      if (!positions[participant.userId]) {
        // Arrange participants in a circle
        const angle = index * angleStep;
        const radius = Math.min(roomSize.width, roomSize.height) * 0.3;
        
        newPositions[participant.userId] = {
          x: roomSize.width / 2 + Math.cos(angle) * radius,
          y: roomSize.height / 2 + Math.sin(angle) * radius,
          z: 0
        };
      } else {
        newPositions[participant.userId] = positions[participant.userId];
      }
    });
    
    setPositions(newPositions);
  }, [participants, roomSize]);
  
  // Process audio streams with spatial positioning
  useEffect(() => {
    if (!enabled || !audioContextRef.current) return;
    
    const audioContext = audioContextRef.current;
    
    Object.entries(remoteStreams).forEach(([userId, stream]) => {
      if (userId === localUserId || !stream.audio) return;
      
      const position = positions[userId];
      if (!position) return;
      
      // Create or update panner node
      if (!pannerNodesRef.current[userId]) {
        const source = audioContext.createMediaStreamSource(stream.audio);
        const panner = audioContext.createPanner();
        const gain = audioContext.createGain();
        
        // Configure panner
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;
        
        // Set initial position
        if (panner.positionX) {
          panner.positionX.value = (position.x - roomSize.width / 2) / 100;
          panner.positionY.value = (position.y - roomSize.height / 2) / 100;
          panner.positionZ.value = position.z / 100;
        } else {
          panner.setPosition(
            (position.x - roomSize.width / 2) / 100,
            (position.y - roomSize.height / 2) / 100,
            position.z / 100
          );
        }
        
        // Connect nodes
        source.connect(panner);
        panner.connect(gain);
        gain.connect(audioContext.destination);
        
        pannerNodesRef.current[userId] = {
          source,
          panner,
          gain
        };
      } else {
        // Update existing panner position
        const { panner } = pannerNodesRef.current[userId];
        
        if (panner.positionX) {
          panner.positionX.value = (position.x - roomSize.width / 2) / 100;
          panner.positionY.value = (position.y - roomSize.height / 2) / 100;
          panner.positionZ.value = position.z / 100;
        } else {
          panner.setPosition(
            (position.x - roomSize.width / 2) / 100,
            (position.y - roomSize.height / 2) / 100,
            position.z / 100
          );
        }
      }
    });
    
    // Clean up removed streams
    Object.keys(pannerNodesRef.current).forEach(userId => {
      if (!remoteStreams[userId]) {
        const nodes = pannerNodesRef.current[userId];
        nodes.source.disconnect();
        nodes.panner.disconnect();
        nodes.gain.disconnect();
        delete pannerNodesRef.current[userId];
      }
    });
  }, [remoteStreams, positions, localUserId, enabled, roomSize]);
  
  // Handle drag and drop
  const handleMouseDown = useCallback((e, userId) => {
    if (userId === localUserId) return; // Can't move self
    
    setIsDragging(userId);
    setSelectedUser(userId);
  }, [localUserId]);
  
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPositions(prev => ({
      ...prev,
      [isDragging]: {
        x: Math.max(0, Math.min(roomSize.width, x)),
        y: Math.max(0, Math.min(roomSize.height, y)),
        z: prev[isDragging]?.z || 0
      }
    }));
  }, [isDragging, roomSize]);
  
  const handleMouseUp = useCallback(() => {
    if (isDragging && onPositionChange) {
      onPositionChange(isDragging, positions[isDragging]);
    }
    setIsDragging(null);
  }, [isDragging, positions, onPositionChange]);
  
  // Render canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw room boundary
      ctx.strokeStyle = '#4a5568';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = '#2d3748';
      ctx.lineWidth = 0.5;
      const gridSize = 50;
      
      for (let x = gridSize; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = gridSize; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw distance circles from local user
      const localPos = positions[localUserId];
      if (localPos) {
        ctx.strokeStyle = 'rgba(66, 153, 225, 0.2)';
        ctx.lineWidth = 1;
        
        [100, 200, 300].forEach(radius => {
          ctx.beginPath();
          ctx.arc(localPos.x, localPos.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
        });
      }
      
      // Draw participants
      participants.forEach(participant => {
        const pos = positions[participant.userId];
        if (!pos) return;
        
        const isLocal = participant.userId === localUserId;
        const isSelected = participant.userId === selectedUser;
        const isSpeaking = audioVisualization[participant.userId] > 0;
        
        // Draw connection line to local user
        if (!isLocal && localPos) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(localPos.x, localPos.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        }
        
        // Draw user circle
        ctx.fillStyle = isLocal ? '#48bb78' : '#4299e1';
        ctx.strokeStyle = isSelected ? '#ed8936' : 'transparent';
        ctx.lineWidth = 3;
        
        const radius = isSpeaking ? 25 + audioVisualization[participant.userId] * 10 : 20;
        
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        if (isSelected) ctx.stroke();
        
        // Draw speaking indicator
        if (isSpeaking) {
          ctx.strokeStyle = '#48bb78';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius + 5, 0, 2 * Math.PI);
          ctx.stroke();
        }
        
        // Draw username
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(participant.username, pos.x, pos.y + radius + 20);
        
        // Draw distance
        if (!isLocal && localPos) {
          const distance = Math.sqrt(
            Math.pow(pos.x - localPos.x, 2) + 
            Math.pow(pos.y - localPos.y, 2)
          );
          
          ctx.fillStyle = '#a0aec0';
          ctx.font = '10px Inter, sans-serif';
          ctx.fillText(`${Math.round(distance)}m`, pos.x, pos.y + radius + 35);
        }
      });
      
      animationFrameRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [participants, positions, localUserId, selectedUser, audioVisualization]);
  
  // Update audio visualization
  useEffect(() => {
    const interval = setInterval(() => {
      const newVisualization = {};
      
      Object.entries(pannerNodesRef.current).forEach(([userId, nodes]) => {
        // This would connect to actual audio analysis
        newVisualization[userId] = Math.random() * 0.5;
      });
      
      setAudioVisualization(newVisualization);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!enabled) {
    return null;
  }
  
  return (
    <div className={styles.spatialAudio}>
      <div className={styles.header}>
        <h3>Spatial Audio</h3>
        <span className={styles.hint}>
          Drag participants to adjust their position in 3D space
        </span>
      </div>
      
      <div className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          width={roomSize.width}
          height={roomSize.height}
          className={styles.canvas}
          onMouseDown={(e) => {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Find clicked participant
            participants.forEach(participant => {
              const pos = positions[participant.userId];
              if (pos) {
                const distance = Math.sqrt(
                  Math.pow(x - pos.x, 2) + 
                  Math.pow(y - pos.y, 2)
                );
                
                if (distance < 25) {
                  handleMouseDown(e, participant.userId);
                }
              }
            });
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      
      <div className={styles.controls}>
        <button
          className={styles.resetButton}
          onClick={() => {
            // Reset positions to circle
            const angleStep = (2 * Math.PI) / participants.length;
            const newPositions = {};
            
            participants.forEach((participant, index) => {
              const angle = index * angleStep;
              const radius = Math.min(roomSize.width, roomSize.height) * 0.3;
              
              newPositions[participant.userId] = {
                x: roomSize.width / 2 + Math.cos(angle) * radius,
                y: roomSize.height / 2 + Math.sin(angle) * radius,
                z: 0
              };
            });
            
            setPositions(newPositions);
          }}
        >
          Reset Positions
        </button>
      </div>
    </div>
  );
};

export default SpatialAudio;