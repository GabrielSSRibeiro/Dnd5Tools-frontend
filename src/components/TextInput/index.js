import React from "react";

import * as util from "../../utils";

import Info from "../Info";

import "./styles.css";

function TextInput({
  isMultiLine = false,
  label = null,
  info = null,
  className = "",
  onChange = () => {},
  value = null,
  propertyPath = null,
  displayProperty = null,
  ...rest
}) {
  function HandleOnChange(e) {
    if (propertyPath) {
      let obj = value;
      util.setObjPropertyValue(obj, propertyPath, e.target.value);

      onChange({ ...obj });
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
        <textarea onChange={HandleOnChange} value={typeof value == "object" ? displayProperty : value} {...rest}></textarea>
      ) : (
        <input type="text" onChange={HandleOnChange} value={typeof value == "object" ? displayProperty : value} {...rest}></input>
      )}
    </div>
  );
}

export default TextInput;
