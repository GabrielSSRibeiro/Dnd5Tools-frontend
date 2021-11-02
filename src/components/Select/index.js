import React, { useState } from "react";

import "./styles.css";

function Select({ label, value, setValue, options, className }) {
  const [isOpen, setIsOpen] = useState(false);

  function HandleClick(option) {
    setIsOpen(false);
    setValue(option);
  }

  return (
    <div className={`Select-container ${className}`}>
      <label>{label}</label>
      <section onClick={() => setIsOpen(!isOpen)}>
        <div>{value}</div>
        <i className="fas fa-caret-down"></i>
      </section>
      {isOpen && (
        <ul>
          {options.map((option) => (
            <li key={option} value={option} onClick={() => HandleClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
