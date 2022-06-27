import React from "react";

import "./styles.css";

function Button({ text, onClick, isDisabled, className = "" }) {
  function HandleClick() {
    onClick();
  }

  return (
    <div className={`Button-container ${isDisabled ? "element-disabled" : ""} ${className}`} onClick={!isDisabled ? HandleClick : () => {}}>
      <div>
        <h5>{text}</h5>
      </div>
    </div>
  );
}

export default Button;
