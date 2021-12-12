import React from "react";

import Jewel from "../Jewel";

import "./styles.css";

function Panel({ title, children }) {
  const jewelSide = 18;

  return (
    <div className="Panel-container">
      {title && (
        <header>
          <aside className="title-gem">
            <Jewel side={jewelSide} variant="panel" />
          </aside>
          <div>
            <h4>{title}</h4>
          </div>
          <aside className="title-gem">
            <Jewel side={jewelSide} variant="panel" />
          </aside>
        </header>
      )}
      <section className="box-top-left-corner" />
      <section className="box-bottom-left-corner" />
      <section className="box-top-right-corner" />
      <section className="box-bottom-right-corner" />
      {children}
    </div>
  );
}

export default Panel;
