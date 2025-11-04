import React from "react";

const ChatList = ({ users, onSelectChat, onAISelect }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <ul>
        {users.map((u) => (
          <li
            key={u.id}
            className="p-2 border-b cursor-pointer hover:bg-gray-700 rounded"
            onClick={() => onSelectChat(u)}
          >
            {u.username}
          </li>
        ))}
        <li
          className="p-2 border-b cursor-pointer hover:bg-gray-700 rounded mt-2 bg-indigo-600 text-white"
          onClick={onAISelect}
        >
          Chat with AI 🤖
        </li>
      </ul>
    </div>
  );
};

export default ChatList;
