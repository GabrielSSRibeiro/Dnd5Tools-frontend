import React from "react";

import "./styles.css";

function Jewel({ side, outerStyle = "gray", innerStyle = "gray-gradient" }) {
  const innerSide = side * 0.6;

  return (
    <div className={`Jewel-container ${outerStyle}-jewel-outerStyle`} style={{ width: side, height: side }}>
      <div className={`${innerStyle}-innerStyle`} style={{ width: innerSide, height: innerSide }}></div>
    </div>
  );
}

export default Jewel;
