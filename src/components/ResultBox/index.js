import React from "react";

import Jewel from "../Jewel";

import "./styles.css";

function ResultBox({
  headers = null,
  subHeaders = null,
  highlightSubHeaders = false,
  highlightTopRow = false,
  resultBackgroundColumn = false,
  values = [{ label: null, top: "", bottom: "" }],
}) {
  function calculateValuesMarginLeft() {
    let marginLeft = 0;
    if (headers && subHeaders) {
      marginLeft += 250;
    } else if (headers && values.length > 3) {
      marginLeft += 250;
    }

    return marginLeft;
  }

  return (
    <div className="ResultBox-container">
      <aside className="title-gem">
        <Jewel side={24} outerStyle="black" innerStyle="black-gradient" />
      </aside>
      <div>
        {headers && (
          <header className="header" style={{ width: subHeaders ? 150 : 250 }}>
            {headers.map((header) => (
              <p key={header}>{header}</p>
            ))}
          </header>
        )}
        {subHeaders && (
          <section className="sub-header">
            <h6 className={`top ${highlightSubHeaders ? "highlight-sub-header" : ""}`}>{subHeaders[0]}</h6>
            <div className="divider"></div>
            <h6 className={`bottom ${highlightSubHeaders ? "highlight-sub-header" : ""}`}>{subHeaders[1]}</h6>
          </section>
        )}
        <main className="main" style={{ marginLeft: calculateValuesMarginLeft() }}>
          {values.map((value, index) => (
            <aside key={index}>
              {resultBackgroundColumn && (
                <div className="column-top" style={{ height: value.label ? 30 : 15 }}>
                  <header style={{ display: value.label ? "" : "none" }}>
                    <Jewel side={15} outerStyle="gray" innerStyle="gray-gradient" />
                  </header>
                  <h6>{value.label}</h6>
                </div>
              )}
              <span className={`top ${highlightTopRow ? "highlight-top-row" : ""}`}>{value.top}</span>
              <div className="divider" style={{ marginTop: highlightTopRow ? -12 : 0 }}></div>
              <h4 className="bottom">{value.bottom}</h4>
              {resultBackgroundColumn && <div className="column-bottom"></div>}
            </aside>
          ))}
        </main>
      </div>
    </div>
  );
}

export default ResultBox;
