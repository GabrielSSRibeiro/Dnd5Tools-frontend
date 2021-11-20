import React from "react";

import "./styles.css";

function TextInput({ label, placeholder, value, className, ...rest }) {
  return (
    <div className={`TextInput-container ${className}`}>
      <label>{label}</label>
      <main>
        <input type="text" placeholder={placeholder} value={value} {...rest}></input>
      </main>
    </div>
  );
}

export default TextInput;
