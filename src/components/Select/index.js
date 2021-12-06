import React, { useState } from "react";

import "./styles.css";

function Select({ isLarge = false, extraWidth = 0, value = "", setValue = () => {}, options = [], className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  const optionsAtATime = 5;
  const selectWidth = 100;
  const height = isLarge ? 58 : 37;

  function HandleClick(option) {
    setIsOpen(false);
    setValue(option);
  }

  return (
    <div className={`Select-container ${className}`} tabIndex="-1" onBlur={() => setIsOpen(false)}>
      <section
        style={{
          width: selectWidth + extraWidth,
          height: height,
        }}
        className={`${isOpen ? "select-open" : "select-closed"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h5 style={{ fontSize: isLarge ? 14 : 12 }}>{value}</h5>
        <i className="fas fa-chevron-down"></i>
      </section>
      {isOpen && (
        <ul
          style={{
            width: selectWidth + extraWidth,
            height: height * options.length + 2,
            maxHeight: height * optionsAtATime + 2,
            borderBottomRightRadius: options.length <= optionsAtATime && 8,
            borderTopRightRadius: options.length <= optionsAtATime && 8,
            overflow: options.length <= optionsAtATime ? "none" : "auto",
            overflowX: options.length <= optionsAtATime ? "none" : "hidden",
          }}
        >
          {options.map((option) => (
            <div key={option}>
              <li
                className="select-item"
                style={{
                  width: (selectWidth + extraWidth) * 0.7,
                  height: height,
                  fontSize: isLarge ? 14 : 12,
                }}
                value={option}
                onClick={() => HandleClick(option)}
              >
                {option}
              </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
