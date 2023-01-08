import React from "react";

import "./styles.css";

function Button({ text, icon = null, onClick = () => {}, isDisabled, className = "" }) {
  function HandleClick() {
    onClick();
  }

  return (
    <div className={`Button-container${isDisabled ? " element-disabled" : ""} ${className}`} onClick={!isDisabled ? HandleClick : () => {}}>
      <div>
        {icon && <i className={icon}></i>}
        {text && <h5>{text}</h5>}
      </div>
    </div>
  );
}

export default Button;
