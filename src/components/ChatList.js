import React, { useState } from "react";
import { useChats } from "../hooks/useChats";

const ChatList = ({ selectedChatId, onChatSelect, onNewChat }) => {
  const { chats = [], loading, error, createChat, deleteChat, updateChatTitle } = useChats();
  const [creatingChat, setCreatingChat] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleCreateChat = async () => {
    setCreatingChat(true);
    try {
      // Await the new chat object directly from the updated createChat hook
      const newChat = await createChat({ title: 'New Conversation' });

      if (newChat && onNewChat) {
        // Pass the fully formed new chat object to the parent to trigger navigation
        onNewChat(newChat);
      }
    } catch (err) {
      console.error('Error creating chat:', err.message);
    } finally {
      setCreatingChat(false);
    }
  };

  const handleDeleteChat = async (chatId, event) => {
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      try {
        await deleteChat(chatId);
        if (selectedChatId === chatId && onChatSelect) {
          onChatSelect(null);
        }
      } catch (error) {
        console.error("Failed to delete chat:", error);
      }
    }
  };

  const handleEditChat = (chat, event) => {
    event.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveTitle = async (chatId, event) => {
    event.stopPropagation();
    if (!editTitle.trim()) {
      setEditingChatId(null);
      return;
    }

    try {
      await updateChatTitle(chatId, editTitle.trim());
      setEditingChatId(null);
    } catch (error) {
      console.error("Failed to update chat title:", error);
    }
  };

  const handleCancelEdit = (event) => {
    event.stopPropagation();
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleKeyPress = (event, chatId) => {
    if (event.key === "Enter") {
      handleSaveTitle(chatId, event);
    } else if (event.key === "Escape") {
      handleCancelEdit(event);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Today";
    } else if (diffDays === 2) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">Error loading chats.</div>;
  }

  if (loading && chats.length === 0) {
    return <div className="p-4 text-gray-400">Loading chats...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={handleCreateChat}
          disabled={creatingChat}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creatingChat ? 'Creating...' : '+ New Chat'}
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <p>No chats yet.</p>
            <p className="text-sm mt-2">Create your first chat to get started!</p>
          </div>
        ) : (
          <ul>
            {chats.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => onChatSelect(chat.id)}
                  className={`w-full text-left p-4 transition-colors duration-200 ${selectedChatId === chat.id ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                >
                  {editingChatId === chat.id ? (
                    <div
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, chat.id)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        className="flex-1 p-2 text-sm border border-gray-400 rounded"
                      />
                      <button
                        onClick={(e) => handleSaveTitle(chat.id, e)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-semibold truncate">{chat.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(chat.updated_at)}
                      </p>
                      {chat.messages_aggregate?.aggregate?.count > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                          {chat.messages_aggregate.aggregate.count} messages
                        </p>
                      )}
                    </>
                  )}
                </button>
                <div className="flex items-center gap-2 ml-2">
                  {editingChatId !== chat.id && (
                    <button
                      onClick={(e) => handleEditChat(chat, e)}
                      className="bg-none border-none text-gray-400 cursor-pointer p-2 transition-colors duration-200 hover:text-indigo-600"
                      title="Edit chat title"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="bg-none border-none text-gray-400 cursor-pointer p-2 transition-colors duration-200 hover:text-red-500"
                    title="Delete chat"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatList;
