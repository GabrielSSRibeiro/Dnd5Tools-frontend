import React from "react";

import Info from "../Info";

import "./styles.css";

function Button({ text, icon = null, info = null, onClick = () => {}, isDisabled, className = "" }) {
  function HandleClick() {
    onClick();
  }

  return (
    <div className={`Button-container${isDisabled ? " element-disabled" : ""} ${className}`} onClick={!isDisabled ? HandleClick : () => {}}>
      <div>
        {icon && <i className={icon}></i>}
        {text && <h5>{text}</h5>}
        {info && <Info className="button-info" contents={info} />}
      </div>
    </div>
  );
}

export default Button;
