import React from 'react';

const Chat = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-700 rounded-md">
      {/* Header */}
      <div className="bg-gray-800 shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-800">John Doe</p>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Sent Message */}
        <div className="flex justify-end">
          <div className="bg-slate-900 text-white p-3 rounded-xl max-w-xs tab:max-w-sm pc:max-w-md">
            Hey! How are you?
          </div>
        </div>

        {/* Received Message */}
        <div className="flex justify-start">
          <div className="bg-gray-300 text-gray-800 p-3 rounded-xl max-w-xs tab:max-w-sm pc:max-w-md">
            I'm great, thanks for asking! How about you?
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-gray-700 p-4 flex items-center gap-2 border-t">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-3 border border-primary-600/30 rounded-xl focus:outline-none bg-transparent shadow-md text-gray-300"
        />
        <button className="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-600/60 transition">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
