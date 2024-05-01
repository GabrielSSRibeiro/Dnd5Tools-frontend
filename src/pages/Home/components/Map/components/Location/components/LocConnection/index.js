import React, { useRef, useMemo } from "react";
import * as utils from "../../../../../../../../utils";
import * as lc from "../../../../../../../../constants/locationConstants";

import "./styles.css";

function LocConnection({ type, angle, angleOrigin }) {
  const conChunks = useRef(utils.createArrayFromInt(10));
  const rotation = useMemo(() => {
    if (!angle) return 0;

    return lc.GetDirection(angle).baseAngle;
  }, [angle]);
  const rotationOrigin = useMemo(() => {
    if (!angleOrigin) return "";

    return " " + lc.GetLocationConnectionAngleOrigin(angleOrigin).cssClass;
  }, [angleOrigin]);
  const color = useRef(lc.GetElementType(lc.GetLocationConnectionType(type).elementType).color);

  return (
    <div
      className={`LocConnection-container df${type === lc.LOCATION_CONNECTION_TYPES.PASSAGE ? " passage" : ""}${rotationOrigin}`}
      style={{ rotate: `${rotation}deg` }}
    >
      {conChunks.current.map((c, i) => (
        <section key={i} style={{ backgroundColor: color.current }}></section>
      ))}
    </div>
  );
}

export default LocConnection;
