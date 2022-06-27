import React, { useState } from "react";

import Tooltip from "../Tooltip";

import "./styles.css";

function Info({ contents }) {
  const [positions, setPositions] = useState({ top: 0, left: 0 });

  function GetComponentPositions(e) {
    setPositions(e.target.getBoundingClientRect());
  }

  return (
    <div className="Info-container" onMouseOver={GetComponentPositions}>
      <i className="fas fa-info"></i>
      <Tooltip contents={contents} top={positions.top} left={positions.left + positions.width / 2} className="tooltip-hover" />
    </div>
  );
}

export default Info;
