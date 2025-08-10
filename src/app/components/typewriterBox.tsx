import React, { useRef } from 'react';
import Typewriter from 'typewriter-effect';

function TypewriterTextBox({ text, typingDelay = 50, mobile = false }) {
  // Mobile layout - larger text and height
  if (mobile) {
    return (
      <div className="px-4 py-4 rounded-xl bg-white shadow-md text-2xl font-medium" 
           style={{ boxShadow: '0 0.3rem #c9bbc8', minHeight: '80px' }}>
        {text && (
        <Typewriter
          options={{
            delay: 30,
            autoStart: true,
          }}
          onInit={(typewriter) => {
            typewriter.typeString(text)
              .pauseFor(1000)
              .start();
          }}
        />
        )}
      </div>
    );
  }
  
  // Desktop layout - original
  return (
    <div className="p-6 rounded bg-white w-5/6 h-1/4 mx-auto my-2 shadow-customBox text-3xl" style={{ borderRadius: '1.5rem', boxShadow: '0 0.7rem #c9bbc8' }}>
      {text && (
      <Typewriter
        options={{
          delay: 50,
          autoStart: true,
        }}
        onInit={(typewriter) => {
          typewriter.typeString(text)
            .pauseFor(1000)
            .start();
        }}
      />
      )}
    </div>
  );
}

export default TypewriterTextBox;
