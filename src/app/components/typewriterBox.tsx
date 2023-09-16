import React, { useState, useEffect, useRef } from 'react';

function TypewriterTextBox({ text, typingDelay = 50}) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 1;
    setDisplayedText(text[0]);

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prevText) => prevText + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, typingDelay);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="p-4 rounded bg-white w-5/6 h-1/4 mx-auto my-2 shadow-customBox text-3xl" style={{ borderRadius: '1.5rem', boxShadow: '0 0.7rem #c9bbc8' }}>
      {displayedText}
    </div>
  );
}

export default TypewriterTextBox;
