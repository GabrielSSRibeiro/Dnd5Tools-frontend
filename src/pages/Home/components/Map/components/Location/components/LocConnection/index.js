import React, { useRef, useMemo } from "react";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as lh from "../../../../../../../../helpers/locationHelper";

import "./styles.css";

function LocConnection({ seed, distance, type, angle, angleOrigin, loc, map, isMobileDevice }) {
  const rotation = useMemo(() => {
    if (!angle) return 0;

    return lc.GetDirection(angle).baseAngle;
  }, [angle]);
  const rotationOrigin = useMemo(() => {
    if (!angleOrigin) return "";

    return " " + lc.GetLocationConnectionAngleOrigin(angleOrigin).cssClass;
  }, [angleOrigin]);

  const height = useMemo(() => {
    if (!loc.data.exteriorLocationId || !map[loc.data.exteriorLocationId]) {
      return null;
    }

    return map[loc.data.exteriorLocationId].data.radius / 2;
  }, [loc.data.exteriorLocationId, map]);
  const color = useRef(lc.GetElementType(lc.GetLocationConnectionType(type).elementType).color);
  const conClipPath = useMemo(() => lh.GetLocConClipPaths(distance, seed), [distance, seed]);
  const conStyles = useMemo(() => {
    let conStyles = {
      height,
      backgroundColor: color.current,
      clipPath: conClipPath,
    };

    //temp fix for performance issue with clip-path
    if (isMobileDevice) {
      conStyles.height = 2;
      conStyles.clipPath = null;
    }

    return conStyles;
  }, [conClipPath, height, isMobileDevice]);

  return (
    <div
      className={`LocConnection-container df df-fd-c${type === lc.LOCATION_CONNECTION_TYPES.PASSAGE ? " passage" : ""}${rotationOrigin}`}
      style={{ rotate: `${rotation * -1}deg` }}
    >
      <section style={conStyles}></section>
    </div>
  );
}

export default LocConnection;
