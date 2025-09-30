import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import ServerIcon from './ServerIcon';
import styles from './ServerList.module.css';

const ServerList = ({ onServerSelect }) => {
  const dispatch = useDispatch();
  
  // Redux state
  const { servers, serverOrder, folders } = useSelector(state => state.servers);
  const { currentServerId } = useSelector(state => state.chat);
  const { unreadCounts, mentionCounts } = useSelector(state => state.notifications);
  
  // Local state
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  
  // Get ordered servers
  const orderedServers = serverOrder.map(id => servers.find(s => s.id === id)).filter(Boolean);
  
  // Handle drag end
  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    
    const { source, destination, type } = result;
    
    if (type === 'server') {
      // Reorder servers
      dispatch({
        type: 'servers/reorder',
        payload: {
          sourceIndex: source.index,
          destinationIndex: destination.index
        }
      });
    } else if (type === 'folder') {
      // Move server to/from folder
      dispatch({
        type: 'servers/moveToFolder',
        payload: {
          serverId: result.draggableId,
          folderId: destination.droppableId,
          index: destination.index
        }
      });
    }
    
    setIsDragging(false);
  }, [dispatch]);
  
  // Toggle folder expansion
  const toggleFolder = useCallback((folderId) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);
  
  // Render server or folder
  const renderServerOrFolder = (item, index) => {
    if (item.type === 'folder') {
      const isExpanded = expandedFolders.has(item.id);
      const folderServers = item.serverIds.map(id => servers.find(s => s.id === id)).filter(Boolean);
      const hasUnread = folderServers.some(s => unreadCounts[s.id] > 0);
      const totalMentions = folderServers.reduce((sum, s) => sum + (mentionCounts[s.id] || 0), 0);
      
      return (
        <Draggable
          key={item.id}
          draggableId={item.id}
          index={index}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={styles.folderContainer}
            >
              <div
                className={`${styles.folder} ${isExpanded ? styles.expanded : ''}`}
                onClick={() => toggleFolder(item.id)}
                {...provided.dragHandleProps}
              >
                <div className={styles.folderIcon}>
                  {/* Show mini server icons */}
                  {folderServers.slice(0, 4).map((server, i) => (
                    <img
                      key={server.id}
                      src={server.icon}
                      alt=""
                      className={styles.miniFolderIcon}
                      style={{
                        top: `${Math.floor(i / 2) * 12}px`,
                        left: `${(i % 2) * 12}px`
                      }}
                    />
                  ))}
                </div>
                
                {hasUnread && <span className={styles.folderUnread} />}
                {totalMentions > 0 && (
                  <span className={styles.folderMentions}>
                    {totalMentions > 99 ? '99+' : totalMentions}
                  </span>
                )}
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className={styles.folderServers}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <Droppable droppableId={item.id} type="folder">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {folderServers.map((server, index) => (
                            <ServerIcon
                              key={server.id}
                              server={server}
                              isActive={currentServerId === server.id}
                              hasUnread={unreadCounts[server.id] > 0}
                              mentions={mentionCounts[server.id]}
                              onClick={() => onServerSelect(server.id)}
                              isDraggable
                              index={index}
                            />
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </Draggable>
      );
    }
    
    // Regular server
    return (
      <ServerIcon
        key={item.id}
        server={item}
        isActive={currentServerId === item.id}
        hasUnread={unreadCounts[item.id] > 0}
        mentions={mentionCounts[item.id]}
        onClick={() => onServerSelect(item.id)}
        isDraggable
        index={index}
      />
    );
  };
  
  return (
    <DragDropContext
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
    >
      <Droppable droppableId="servers" type="server">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${styles.serverList} ${isDragging ? styles.dragging : ''}`}
          >
            {orderedServers.map((item, index) => renderServerOrFolder(item, index))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ServerList;