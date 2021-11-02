import React from "react";

import "./styles.css";

function CheckInput({ onClick, className, isSelected }) {
  return (
    <div
      onClick={onClick}
      className={`CheckInput-container 
      ${className} 
      ${isSelected && "check-checked"}`}
    >
      {isSelected && <i className="fas fa-check"></i>}
    </div>
  );
}

export default CheckInput;
