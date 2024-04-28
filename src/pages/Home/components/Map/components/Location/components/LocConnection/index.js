import React, { useRef } from "react";
import * as utils from "../../../../../../../../utils";
import * as lc from "../../../../../../../../constants/locationConstants";

import "./styles.css";

function LocConnection({ type }) {
  const conChunks = useRef(utils.createArrayFromInt(10));
  const color = useRef(lc.GetElementType(lc.GetLocationConnectionType(type).elementType).color);

  return (
    <div className={`LocConnection-container df${type === lc.LOCATION_CONNECTION_TYPES.PASSAGE ? " passage" : ""}`}>
      {conChunks.current.map((c, i) => (
        <section key={i} style={{ backgroundColor: color.current }}></section>
      ))}
    </div>
  );
}

export default LocConnection;
