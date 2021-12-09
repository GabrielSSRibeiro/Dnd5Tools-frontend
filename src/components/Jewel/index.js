import React from "react";

import "./styles.css";

function Jewel({ side, variant = "panel" }) {
  const innerSide = side * 0.6;

  return (
    <div className={`Jewel-container ${variant}-jewel-outerStyle`} style={{ width: side, height: side }}>
      <div className={`${variant}-innerStyle`} style={{ width: innerSide, height: innerSide }}></div>
    </div>
  );
}

export default Jewel;
