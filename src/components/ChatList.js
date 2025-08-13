import React, { useState } from "react";
import { useChats } from "../hooks/useChats";

const ChatList = ({ selectedChatId, onChatSelect, onNewChat }) => {
  const { chats = [], loading, error, createChat, deleteChat, updateChatTitle } = useChats();
  const [creatingChat, setCreatingChat] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // Handle error state
  if (error) {
    console.error('Error in ChatList:', error);
    // Optionally show an error message to the user
    return (
      <div className="p-4 text-red-500">
        Error loading chats. Please try refreshing the page.
      </div>
    );
  }

  // Handle loading state
  if (loading && chats.length === 0) {
    return <div className="p-4 text-gray-500">Loading chats...</div>;
  }

  const handleCreateChat = async () => {
    setCreatingChat(true);
    try {
      const newChat = await createChat();
      if (newChat && onNewChat) {
        onNewChat(newChat);
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
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

  if (loading) {
    return (
      <div style={{ padding: "1rem" }}>
        <div>Loading chats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "1rem", color: "#e74c3c" }}>
        <div>Error loading chats: {error.message}</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: "1rem", borderBottom: "1px solid #e0e0e0" }}>
        <button
          onClick={handleCreateChat}
          disabled={creatingChat}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: creatingChat ? "not-allowed" : "pointer",
            fontSize: "0.875rem",
            fontWeight: "500",
          }}
        >
          {creatingChat ? "Creating..." : "+ New Chat"}
        </button>
      </div>

      <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
        {chats.length === 0 ? (
          <div style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
            <p>No chats yet.</p>
            <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
              Create your first chat to get started!
            </p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect && onChatSelect(chat)}
              style={{
                padding: "1rem",
                borderBottom: "1px solid #f0f0f0",
                cursor: "pointer",
                backgroundColor:
                  selectedChatId === chat.id ? "#f8f9fa" : "transparent",
                borderLeft:
                  selectedChatId === chat.id
                    ? "3px solid #667eea"
                    : "3px solid transparent",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (selectedChatId !== chat.id) {
                  e.target.style.backgroundColor = "#f8f9fa";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedChatId !== chat.id) {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingChatId === chat.id ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, chat.id)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        style={{
                          flex: 1,
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.875rem",
                          border: "1px solid #667eea",
                          borderRadius: "3px",
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={(e) => handleSaveTitle(chat.id, e)}
                        style={{
                          background: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "3px",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        style={{
                          background: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "3px",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#333",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {chat.title}
                      </h4>
                      <p
                        style={{
                          margin: "0.25rem 0 0 0",
                          fontSize: "0.75rem",
                          color: "#666",
                        }}
                      >
                        {formatDate(chat.updated_at)}
                      </p>
                      {chat.messages_aggregate?.aggregate?.count > 0 && (
                        <p
                          style={{
                            margin: "0.25rem 0 0 0",
                            fontSize: "0.75rem",
                            color: "#888",
                          }}
                        >
                          {chat.messages_aggregate.aggregate.count} messages
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    marginLeft: "0.5rem",
                  }}
                >
                  {editingChatId !== chat.id && (
                    <button
                      onClick={(e) => handleEditChat(chat, e)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#999",
                        cursor: "pointer",
                        padding: "0.25rem",
                        fontSize: "0.75rem",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "#667eea";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "#999";
                      }}
                      title="Edit chat title"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#999",
                      cursor: "pointer",
                      padding: "0.25rem",
                      fontSize: "0.75rem",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#e74c3c";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#999";
                    }}
                    title="Delete chat"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
