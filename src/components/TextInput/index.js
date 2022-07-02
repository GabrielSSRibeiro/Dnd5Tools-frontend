import React from "react";

import Info from "../Info";

import "./styles.css";

function TextInput({ isMultiLine = false, label = null, info = null, className = "", onChange = () => {}, value = null, property = null, ...rest }) {
  function HandleOnChange(e) {
    if (property) {
      value[property] = e.target.value;
      onChange({ ...value });
    } else {
      onChange(e.target.value);
    }
  }

  return (
    <div className={`TextInput-container ${className}`}>
      <div className={`label-wrapper ${label && info ? "label-and-info" : !info ? "label" : "info"}`}>
        {label && <label>{label}</label>}
        {info && <Info contents={info} />}
      </div>
      {isMultiLine ? (
        <textarea onChange={HandleOnChange} value={property ? value[property] : value} {...rest}></textarea>
      ) : (
        <input type="text" onChange={HandleOnChange} value={property ? value[property] : value} {...rest}></input>
      )}
    </div>
  );
}

export default TextInput;
