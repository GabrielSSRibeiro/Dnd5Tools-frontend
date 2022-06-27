import React from "react";

import "./styles.css";

function SelectButton({ isLarge = false, isSelected = false, isLong = false, text = "", onClick = () => {}, isDisabled = false, className = "" }) {
  const containerWidth = 160;
  const containerHeight = 27;
  const containerLongExtra = 35;
  const containerLargeExtra = { width: 45, height: 7 };
  const containerBorderExtra = { width: 2, height: 2 };

  const buttonSide = 104;
  const buttonLongExtra = 25;
  const buttonLargeExtra = 36;
  const buttonBorderExtra = 2;

  const variant = {
    container: {
      secondBorder: {
        width: containerWidth + containerBorderExtra.width * 2 + (isLarge && containerLargeExtra.width) + (isLong && containerLongExtra),
        height: containerHeight + containerBorderExtra.height * 2 + (isLarge && containerLargeExtra.height),
        cursor: isDisabled ? "default" : "pointer",
      },
      firstBorder: {
        width: containerWidth + containerBorderExtra.width + (isLarge && containerLargeExtra.width) + (isLong && containerLongExtra),
        height: containerHeight + containerBorderExtra.height + (isLarge && containerLargeExtra.height),
      },
      body: {
        width: containerWidth + (isLarge && containerLargeExtra.width) + (isLong && containerLongExtra),
        height: containerHeight + (isLarge && containerLargeExtra.height),
      },
    },
    button: {
      secondBorder: {
        width: buttonSide + buttonBorderExtra * 2 + (isLarge && buttonLargeExtra) + (isLong && buttonLongExtra),
        height: buttonSide + buttonBorderExtra * 2 + (isLarge && buttonLargeExtra) + (isLong && buttonLongExtra),
      },
      firstBorder: {
        width: buttonSide + buttonBorderExtra + (isLarge && buttonLargeExtra) + (isLong && buttonLongExtra),
        height: buttonSide + buttonBorderExtra + (isLarge && buttonLargeExtra) + (isLong && buttonLongExtra),
      },
      body: {
        width: buttonSide + (isLarge && buttonLargeExtra) + (isLong && buttonLongExtra),
        height: buttonSide + (isLarge && buttonLargeExtra) + (isLong && buttonLongExtra),
      },
    },
  };

  function HandleClick() {
    onClick();
  }

  return (
    <div className="SelectButton-container" style={variant.container.secondBorder} onClick={!isDisabled ? HandleClick : () => {}}>
      {/* border 2 */}
      <section style={variant.container.secondBorder}>
        <main
          className={`
          button-${isSelected ? "selected" : "default"} 
         ${className}`}
          style={variant.button.secondBorder}
        ></main>
      </section>
      {/* border 1 */}
      <section style={variant.container.firstBorder}>
        <main
          className={`
          button-${!isSelected ? "selected" : "default"} 
        ${isDisabled && "element-disabled"} ${className}`}
          style={variant.button.firstBorder}
        ></main>
      </section>
      {/* button body */}
      <section style={variant.container.body}>
        <main
          className={`
          button-${isSelected ? "selected" : "default"} 
        ${isDisabled && "element-disabled"} ${className}`}
          style={variant.button.body}
        >
          {isLarge ? (
            <h5
              className={`
          text-${isSelected ? "selected" : "default"} `}
            >
              {text}
            </h5>
          ) : (
            <h6
              className={`
          text-${isSelected ? "selected" : "default"} `}
            >
              {text}
            </h6>
          )}
        </main>
      </section>
    </div>
  );
}

export default SelectButton;
