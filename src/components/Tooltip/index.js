import React from "react";

import "./styles.css";

function Tooltip({ contents, top = 0, left = 0, className = "" }) {
  const marginBottom = 10;

  return (
    <div className={`Tooltip-container ${className}`} style={{ top: top - marginBottom, left }}>
      <div className="tooltip-contents">
        {contents.map((content) => (
          <div className="content-wrapper">
            {content.icon && <i className={content.icon}></i>}
            <span>{content.text}</span>
          </div>
        ))}
      </div>
      <div className="arrow"></div>
    </div>
  );
}

export default Tooltip;
