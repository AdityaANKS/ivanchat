import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ChannelItem from './ChannelItem';
import styles from './ChannelList.module.css';

const ChannelList = ({
  channels = [],
  serverId,
  currentChannelId,
  canManageChannels,
  voiceStates = {},
  isDraggable = false
}) => {
  if (!channels || channels.length === 0) {
    return null;
  }
  
  return (
    <div className={styles.channelList}>
      {channels.map((channel, index) => {
        if (isDraggable) {
          return (
            <Draggable
              key={channel.id}
              draggableId={channel.id}
              index={index}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={provided.draggableProps.style}
                >
                  <ChannelItem
                    channel={channel}
                    serverId={serverId}
                    isActive={currentChannelId === channel.id}
                    isDragging={snapshot.isDragging}
                    canManage={canManageChannels}
                    voiceStates={voiceStates[channel.id]}
                  />
                </div>
              )}
            </Draggable>
          );
        }
        
        return (
          <ChannelItem
            key={channel.id}
            channel={channel}
            serverId={serverId}
            isActive={currentChannelId === channel.id}
            canManage={canManageChannels}
            voiceStates={voiceStates[channel.id]}
          />
        );
      })}
    </div>
  );
};

export default ChannelList;