import React from "react";

import "./styles.css";

function CheckInput({ label = null, onClick = () => {}, isSelected = false, className = "" }) {
  return (
    <div onClick={onClick} className={`CheckInput-container ${className}`}>
      <button className={`${isSelected && "check-checked"}`}>{isSelected && <i className="fas fa-check fa-xs"></i>}</button>
      {label && <label>{label}</label>}
    </div>
  );
}

export default CheckInput;
