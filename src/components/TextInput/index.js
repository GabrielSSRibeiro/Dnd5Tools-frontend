import React from "react";

import Info from "../Info";

import "./styles.css";

function TextInput({ label = null, info = null, placeholder = "", value, className = "", ...rest }) {
  return (
    <div className={`TextInput-container ${className}`}>
      <div className={`label-wrapper ${label && info ? "label-and-info" : !info ? "label" : "info"}`}>
        {label && <span>{label}</span>}
        {info && <Info contents={info} />}
      </div>
      <main>
        <input type="text" placeholder={placeholder} value={value} {...rest}></input>
      </main>
    </div>
  );
}

export default TextInput;
