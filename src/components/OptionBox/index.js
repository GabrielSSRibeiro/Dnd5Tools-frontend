import React from "react";
import SelectButton from "../SelectButton";

import "./styles.css";

function OptionBox({ title, options, value, setValue }) {
  return (
    <div className="OptionBox-container">
      <header>
        <aside className="title-gem">
          <div>
            <div />
          </div>
        </aside>
        <div>
          <h4>{title}</h4>
        </div>
        <aside className="title-gem">
          <div>
            <div />
          </div>
        </aside>
      </header>
      <section className="box-top-left-corner" />
      <section className="box-bottom-left-corner" />
      <section className="box-top-right-corner" />
      <section className="box-bottom-right-corner" />
      <main>
        {options.map((option) => (
          <SelectButton key={option} isLarge={false} isLong={false} isSelected={value === option} text={option} onClick={() => setValue(option)} />
        ))}
      </main>
    </div>
  );
}

export default OptionBox;
