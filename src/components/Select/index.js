import React, { useState } from "react";

import "./styles.css";

function Select({ isLarge, isLong, value, setValue, options, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectWidth = 105;
  const selectHeight = 37;
  const selectLongExtra = 35;
  const selectLargeExtra = { width: 90, height: 21 };

  const variant = {
    select: {
      width: selectWidth + (isLarge && selectLargeExtra.width) + (isLong && selectLongExtra),
      height: selectHeight + (isLarge && selectLargeExtra.height),
    },
    optionBox: {
      width: selectWidth + (isLarge && selectLargeExtra.width) + (isLong && selectLongExtra),
      height: (selectHeight + (isLarge && selectLargeExtra.height)) * options.length + options.length + 2,
      maxHeight: (selectHeight + (isLarge && selectLargeExtra.height)) * 5 + 5 + 2,
      borderBottomRightRadius: options.length <= 5 && 8,
      borderTopRightRadius: options.length <= 5 && 8,
      overflow: options.length <= 5 ? "none" : "auto",
      overflowX: options.length <= 5 ? "none" : "hidden",
    },
    option: {
      width: (selectWidth + (isLarge && selectLargeExtra.width) + (isLong && selectLongExtra)) * 0.6,
      height: Math.floor(((selectHeight + (isLarge && selectLargeExtra.height)) * options.length + options.length) / options.length),
    },
  };

  function HandleClick(option) {
    setIsOpen(false);
    setValue(option);
  }

  return (
    <div className={`Select-container ${className}`} tabIndex="-1" onBlur={() => setIsOpen(false)}>
      <section style={variant.select} className={`${isOpen ? "select-open" : "select-closed"}`} onClick={() => setIsOpen(!isOpen)}>
        <h5>{value}</h5>
        <i className="fas fa-chevron-down"></i>
      </section>
      {isOpen && (
        <ul style={variant.optionBox}>
          {options.map((option) => (
            <li key={option} style={variant.option} value={option} onClick={() => HandleClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
