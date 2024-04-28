import React, { useState, useMemo } from "react";

import * as util from "../../utils";

import Info from "../Info";

import "./styles.css";

function Select({
  isLarge = false,
  extraWidth = 0,
  value = "",
  valuePropertyPath = null,
  onSelect = () => {},
  options = [],
  optionDisplay = (o) => o,
  optionValue = (o) => o,
  label = null,
  info = null,
  nothingSelected = null,
  dropUp = false,
  optionsAtATime = 5,
  className = "",
  isDisabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectOptions = useMemo(() => (nothingSelected ? [nothingSelected, ...options] : options), [options, nothingSelected]);
  const selectWidth = 100;
  const height = isLarge ? 55 : 37;
  const ulStyles = useMemo(() => {
    let ulStyles = {
      width: selectWidth + extraWidth,
      height: height * selectOptions.length + 2,
      maxHeight: height * optionsAtATime + 2,
      overflow: selectOptions.length <= optionsAtATime ? "none" : "auto",
      overflowX: selectOptions.length <= optionsAtATime ? "none" : "hidden",
    };

    if (dropUp) {
      ulStyles.top = `calc(-1 * (${selectOptions.length}00% + ${(label ? (selectOptions.length + 1) * -23 : 0) + 5}px))`;
    }

    return ulStyles;
  }, [dropUp, extraWidth, height, label, optionsAtATime, selectOptions.length]);
  const selectedOption = useMemo(() => {
    let selectedValue = (valuePropertyPath ? util.getObjPropertyValue(value, valuePropertyPath) : value) || nothingSelected;
    let selectedOption = options.find((o) => optionValue(o) === selectedValue);

    return selectedOption;
  }, [nothingSelected, optionValue, options, value, valuePropertyPath]);

  function HandleClick(option) {
    setIsOpen(false);
    if (valuePropertyPath) {
      let obj = value;
      if (option !== nothingSelected) {
        util.setObjPropertyValue(obj, valuePropertyPath, optionValue(option));
      } else {
        util.setObjPropertyValue(obj, valuePropertyPath, null);
      }

      onSelect({ ...obj });
    } else {
      if (option !== nothingSelected) {
        onSelect(optionValue(option));
      } else {
        onSelect(null);
      }
    }
  }

  return (
    <div className={`Select-container ${className}`} tabIndex="-1" onBlur={() => setIsOpen(false)}>
      {(label || info) && (
        <div className={`label-wrapper ${label && info ? "label-and-info" : !info ? "label" : "info"}`}>
          {label && <span>{label}</span>}
          {info && <Info contents={info} />}
        </div>
      )}
      <section
        style={{
          width: selectWidth + extraWidth,
          height: height,
        }}
        className={`
        ${isOpen ? "select-open" : "select-closed"} ${isDisabled ? "element-disabled" : ""}
        `}
        onClick={() => (!isDisabled ? setIsOpen(!isOpen) : {})}
      >
        {selectedOption ? (
          <div className="df df-cg-5">
            {selectedOption.icon && <i className={selectedOption.icon}></i>}

            <h5 style={{ fontSize: isLarge ? 14 : 12 }}>{optionDisplay(selectedOption)}</h5>
            {selectedOption.info && <Info contents={selectedOption.info} />}
          </div>
        ) : (
          <h5 style={{ fontSize: isLarge ? 14 : 12 }}>{nothingSelected}</h5>
        )}
        <i className="fas fa-chevron-down"></i>
      </section>
      {isOpen && (
        <ul style={ulStyles}>
          {selectOptions.map((option) => (
            <div key={option === nothingSelected ? nothingSelected : optionDisplay(option)} style={{ padding: "0 10px" }}>
              <li
                className="df df-cg-5 select-item"
                style={{
                  width: (selectWidth + extraWidth) * 1,
                  height: height,
                  fontSize: isLarge ? 14 : 12,
                }}
                value={option === nothingSelected ? nothingSelected : optionDisplay(option)}
                onClick={() => HandleClick(option)}
              >
                {option.icon && <i className={option.icon}></i>}
                {option === nothingSelected ? nothingSelected : optionDisplay(option)}
                {option.info && <Info contents={option.info} />}
              </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
