import React from "react";

import "./styles.css";

function ResultBox({
  header = "",
  highlightHeader = false,
  subHeader = "",
  highlightSubHeader = false,
  highlightTopRow = false,
  highlightBottomRow = false,
  resultBackgroundColumn = false,
  resultBackgroundColumnTitle = null,
  values = [{ label: null, topValue: "", bottomValue: "" }],
}) {
  return (
    <div className="ResultBox-container">
      <div></div>
    </div>
  );
}

export default ResultBox;
