import React, { useState } from "react";

import "./styles.css";

function Select({
  isLarge = false,
  extraWidth = 0,
  value = "",
  onSelect = () => {},
  defaultValue = null,
  options = [],
  dropUp = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectOptions = defaultValue ? [defaultValue, ...options] : options;
  const optionsAtATime = 5;
  const selectWidth = 100;
  const height = isLarge ? 55 : 37;

  function HandleClick(option) {
    setIsOpen(false);
    if (option !== defaultValue) {
      onSelect(option);
    } else {
      onSelect(null);
    }
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
        <h5 style={{ fontSize: isLarge ? 14 : 12 }}>{value || defaultValue}</h5>
        <i className="fas fa-chevron-down"></i>
      </section>
      {isOpen && (
        <ul
          style={{
            bottom: dropUp ? `calc(${selectOptions.length <= 4 ? selectOptions.length + 1 : 6}00% + 5px)` : -5,
            width: selectWidth + extraWidth,
            height: height * selectOptions.length + 2,
            maxHeight: height * optionsAtATime + 2,
            // borderBottomRightRadius: selectOptions.length <= optionsAtATime && 8,
            // borderTopRightRadius: selectOptions.length <= optionsAtATime && 8,
            overflow: selectOptions.length <= optionsAtATime ? "none" : "auto",
            overflowX: selectOptions.length <= optionsAtATime ? "none" : "hidden",
          }}
        >
          {selectOptions.map((option) => (
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
