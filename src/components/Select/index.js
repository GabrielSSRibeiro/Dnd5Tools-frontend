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
  icon = null,
  preDisplay = null,
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
      const mod = Math.min(optionsAtATime, selectOptions.length);
      ulStyles.top = `calc(-1 * (${mod}00% + ${(label ? (mod + 1) * -23 : 0) + 5}px))`;
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
    <div className={`Select-container ${className}`} onBlur={() => setIsOpen(false)}>
      {(label || info) && (
        <div className={`label-wrapper ${label && info ? "label-and-info" : !info ? "label" : "info"}`}>
          {(icon || preDisplay || label) && (
            <div className="df df-cg-5">
              {icon && <i className={icon}></i>}
              {preDisplay && <span className="bold">{preDisplay}</span>}
              {label && <span>{label}</span>}
            </div>
          )}
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
            {selectedOption.preDisplay && <h5 style={{ fontSize: isLarge ? 14 : 12 }}>{selectedOption.preDisplay}</h5>}
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
          {selectOptions.map((option, i) => (
            <div
              key={option === nothingSelected ? nothingSelected : i}
              className={`${option.newSection ? "new-option-section" : ""}`}
              style={{ padding: "0 10px" }}
            >
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
                {option.preDisplay && <span className="bold">{option.preDisplay}</span>}
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
