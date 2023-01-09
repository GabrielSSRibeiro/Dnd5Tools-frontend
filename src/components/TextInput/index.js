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
  valuePropertyPath = null,
  ...rest
}) {
  function HandleOnChange(e) {
    if (valuePropertyPath) {
      let obj = value;
      util.setObjPropertyValue(obj, valuePropertyPath, e.target.value);

      onChange({ ...obj });
    } else {
      onChange(e.target.value);
    }
  }

  return (
    <div className={`TextInput-container ${className}`}>
      {(label || info) && (
        <div className={`label-wrapper ${label && info ? "label-and-info" : !info ? "label" : "info"}`}>
          {label && <label>{label}</label>}
          {info && <Info contents={info} />}
        </div>
      )}
      {isMultiLine ? (
        <textarea
          onChange={HandleOnChange}
          value={(valuePropertyPath ? util.getObjPropertyValue(value, valuePropertyPath) : value) ?? ""}
          {...rest}
        ></textarea>
      ) : (
        <input
          type="text"
          onChange={HandleOnChange}
          value={(valuePropertyPath ? util.getObjPropertyValue(value, valuePropertyPath) : value) ?? ""}
          {...rest}
        ></input>
      )}
    </div>
  );
}

export default TextInput;
