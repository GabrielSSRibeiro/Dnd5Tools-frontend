import React from "react";

import "./styles.css";

function TextInput({
  label,
  placeholder,
  errorMessage,
  results,
  value,
  className,
  ...rest
}) {
  return (
    <div className={`TextInput-container ${className}`}>
      <label>{label}</label>
      <main>
        <input
          type="text"
          placeholder={placeholder}
          className={results === errorMessage ? "text-noResults" : ""}
          value={value}
          {...rest}
        ></input>
        {results && (
          <i
            className={`fas ${
              results && results !== errorMessage
                ? "fa-check"
                : "fa-exclamation-triangle"
            }`}
          ></i>
        )}
      </main>
      <p>{results === errorMessage && errorMessage}</p>
    </div>
  );
}

export default TextInput;
