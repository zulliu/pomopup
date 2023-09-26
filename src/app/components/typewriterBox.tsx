import React, { useRef } from 'react';
import Typewriter from 'typewriter-effect';

function TypewriterTextBox({ text, typingDelay = 50 }) {
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
