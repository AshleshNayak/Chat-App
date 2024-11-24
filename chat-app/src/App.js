import React, { useState, useRef } from 'react';
import { Send, User, Phone, Video, MoreVertical, Paperclip, ArrowLeft, Image, File, Upload, X } from 'lucide-react';

const ChatApp = () => {
  const [username, setUsername] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const profilePhotoRef = useRef(null);
  
  const chatRooms = [
    { id: 1, name: "Tech Discussion", activeUsers: 4 },
    { id: 2, name: "Random Talk", activeUsers: 2 },
    { id: 3, name: "Group Chat", activeUsers: 10 },
  ];

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsNameSubmitted(true);
    }
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkip = () => {
    setIsLoggedIn(true);
  };

  const handleJoinChat = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsNameSubmitted(false);
    setUsername('');
    setCurrentRoom(null);
    setMessages([]);
    setProfilePhoto(null);
  };

  const handleJoinRoom = (room) => {
    setCurrentRoom(room);
    setMessages([]); // Clear message when joining new room
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && currentRoom) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: message,
        sender: "me",
        type: "text",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage('');
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMessages([...messages, {
          id: messages.length + 1,
          sender: "me",
          type: type,
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
            url: event.target.result
          },
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      };
      reader.readAsDataURL(file);
    }
    setShowFileMenu(false);
  };

  const renderMessage = (msg) => {
    switch (msg.type) {
      case 'image':
        return (
          <div className="relative">
            <img 
              src={msg.file.url} 
              alt="Uploaded" 
              className="max-w-sm rounded-lg"
            />
            <div className="text-xs mt-1">
              {msg.file.name} ({(msg.file.size / 1024).toFixed(1)} KB)
            </div>
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center space-x-2">
            <File size={24} />
            <div>
              <div className="font-medium">{msg.file.name}</div>
              <div className="text-xs">
                {(msg.file.size / 1024).toFixed(1)} KB
              </div>
            </div>
          </div>
        );
      default:
        return <div>{msg.text}</div>;
    }
  };

  // Name Input Screen
  if (!isNameSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Chat App</h2>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-2">Enter your name</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Your name"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Profile Photo Upload Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-2 text-center">Add Profile Photo</h2>
          <p className="text-gray-500 text-center mb-6">Hello, {username}! Would you like to add a profile photo?</p>
          
          <div className="mb-6 flex flex-col items-center">
            <div className="relative">
              <div 
                className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2 overflow-hidden"
                style={{
                  backgroundImage: profilePhoto ? `url(${profilePhoto})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!profilePhoto && <User size={40} className="text-gray-400" />}
              </div>
              {profilePhoto && (
                <button
                  onClick={() => setProfilePhoto(null)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <input
              type="file"
              ref={profilePhotoRef}
              accept="image/*"
              onChange={handleProfilePhotoUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => profilePhotoRef.current?.click()}
              className="text-blue-500 hover:text-blue-600 text-sm flex items-center space-x-1"
            >
              <Upload size={16} />
              <span>{profilePhoto ? 'Change Photo' : 'Upload Photo'}</span>
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            <button
              onClick={handleJoinChat}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Join Chat
            </button>
            <button
              onClick={handleSkip}
              className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If logged in but no room selected, show room selection
  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {profilePhoto ? (
                <div 
                  className="w-10 h-10 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${profilePhoto})` }}
                />
              ) : (
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
              )}
              <span className="font-semibold">Welcome, {username}!</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} className="mr-1" />
              Back
            </button>
          </div>
          <h2 className="text-xl font-bold mb-4">Available Chat Rooms</h2>
          <div className="space-y-3">
            {chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => handleJoinRoom(room)}
                className="w-full p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-semibold">{room.name}</div>
                <div className="text-sm text-gray-500">{room.activeUsers} active users</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main Chat Interface
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {profilePhoto ? (
              <div 
                className="w-10 h-10 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${profilePhoto})` }}
              />
            ) : (
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
            )}
            <span className="font-semibold">{username}</span>
          </div>
          <button 
            onClick={() => setCurrentRoom(null)}
            className="text-blue-500 hover:text-blue-600"
          >
            Change Room
          </button>
        </div>

        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">{currentRoom.name}</h2>
          <p className="text-sm text-gray-500">{currentRoom.activeUsers} active users</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">ACTIVE USERS</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                {profilePhoto ? (
                  <div 
                    className="w-8 h-8 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${profilePhoto})` }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="text-gray-500" size={16} />
                  </div>
                )}
                <span className="text-sm">{username} (You)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="text-gray-500" size={20} />
            </div>
            <div>
              <div className="font-semibold">{currentRoom.name}</div>
              <div className="text-sm text-green-500">Active Now</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="text-gray-500 cursor-pointer" size={20} />
            <Video className="text-gray-500 cursor-pointer" size={20} />
            <MoreVertical className="text-gray-500 cursor-pointer" size={20} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-white rounded-lg px-4 py-2 text-sm text-gray-500">
                Welcome to {currentRoom.name}!
              </div>
            </div>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg p-3 ${msg.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                  {renderMessage(msg)}
                  <div className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {username} • {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 border-t">
          <form onSubmit={handleSend} className="flex items-center space-x-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFileMenu(!showFileMenu)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <Paperclip size={20} />
              </button>
              
              {/* File Upload Menu */}
              {showFileMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border p-2 w-48">
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'image')}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'file')}
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded"
                  >
                    <Image size={16} />
                    <span>Upload Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded"
                  >
                    <File size={16} />
                    <span>Upload File</span>
                  </button>
                </div>
              )}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 focus:outline-none"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;