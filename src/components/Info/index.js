import React, { useState } from "react";

import Tooltip from "../Tooltip";

import "./styles.css";

function Info({ contents, tooltipOnly = false, className = "" }) {
  const [positions, setPositions] = useState({ width: 0, top: 0, left: 0 });

  function GetComponentPositions(e) {
    setPositions(e.target.getBoundingClientRect());
  }

  return (
    <div className={`Info-container${tooltipOnly ? " tooltip-only" : ""} ${className}`} onMouseOver={GetComponentPositions}>
      <i className="fas fa-info"></i>
      {contents && <Tooltip contents={contents} top={positions.top} left={positions.left + positions.width / 2} className="tooltip-hover" />}
    </div>
  );
}

export default Info;
