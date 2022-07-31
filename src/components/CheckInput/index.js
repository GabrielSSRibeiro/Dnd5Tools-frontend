import React from "react";

import Info from "../Info";

import "./styles.css";

function CheckInput({ label = null, info = null, onClick = () => {}, isSelected = false, isDisabled = false, className = "" }) {
  return (
    <div onClick={!isDisabled ? onClick : () => {}} className={`CheckInput-container ${className} ${isDisabled ? "element-disabled" : ""}`}>
      <button className={`${isSelected && "check-checked"}`}>{isSelected && <i className="fas fa-check fa-xs"></i>}</button>
      {label && <label>{label}</label>}
      {info && <Info contents={info} />}
    </div>
  );
}

export default CheckInput;
