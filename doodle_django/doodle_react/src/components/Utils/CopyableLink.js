import React, { useState, useRef, useEffect } from 'react';
import PrimaryButton from "../Utils/PrimaryButton";

const CopyableLink = ({ path }) => {
  const [linkValue, setLinkValue] = useState('http://localhost:3000/' + path);
  const linkInputRef = useRef(null);

  const copyToClipboard = () => {
    if (linkInputRef.current) {
      linkInputRef.current.select();
      navigator.clipboard.writeText(linkValue)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch((err) => {
          console.error('Error copying to clipboard: ', err);
        });
    }
  };


  useEffect(() => {
    setLinkValue('http://localhost:3000/' + path);
  }, [path]);


  const adjustInputWidth = () => {
    if (linkInputRef.current) {
      linkInputRef.current.style.width = `${linkInputRef.current.scrollWidth}px`;
    }
  };


  useEffect(() => {
    adjustInputWidth();
  }, [linkValue]);


  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        value={linkValue}
        readOnly
        ref={linkInputRef}
        onClick={copyToClipboard}
        style={{ flex: '1', marginRight: '8px', overflow: 'hidden' }}
      />
      <PrimaryButton
        text="Copy to clipboard"
        style={{ minWidth: '140px', height: 'fit-content' }}
        functionOnClick={copyToClipboard}
        variant="contained"
      />
    </div>
  );
};

export default CopyableLink;