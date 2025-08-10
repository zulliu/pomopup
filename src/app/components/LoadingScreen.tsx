import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center font-exe-pixel">
      <img
        src="/plogo.svg"
        alt="logo"
        className="ml-2 mb-8 animate-pulse"
        style={{ width: '20%', height: 'auto' }}
      />
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <p className="mt-4 text-2xl text-gray-600">Loading your puppy...</p>
    </div>
  );
};

export default LoadingScreen;