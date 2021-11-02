import React from "react";

import "./styles.css";

function RadioInput({ onClick, className, isSelected }) {
  return (
    <div onClick={onClick} className={`RadioInput-container ${className}`}>
      {isSelected && <div className="innerCircle" />}
    </div>
  );
}

export default RadioInput;
