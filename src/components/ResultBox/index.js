import React from "react";

import "./styles.css";

function ResultBox({
  header = "",
  highlightHeader = false,
  subHeader = "",
  highlightSubHeader = false,
  highlightTopRow = false,
  highlightBottomRow = false,
  columnBehind = false,
  values = [{ label: null, topValue: "", bottomValue: "" }],
}) {
  return <div className="ResultBox-container"></div>;
}

export default ResultBox;
