import React from 'react';

const ImageModal = ({ image, onClose }) => {

  console.log('image prop:', image);

  return (
    <div className="modal-overlay">
      <div className="Modal">
        <div className="Modal-Content">
          <span className="Close" onClick={onClose}>
            &times;
          </span>
          {image ? (
            <img src={image} alt="Bigger car image" />
          ) : (
            <div>
              <img src={defaultImage} alt="Default car image" />
              <p>Image not available</p>
             
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;

