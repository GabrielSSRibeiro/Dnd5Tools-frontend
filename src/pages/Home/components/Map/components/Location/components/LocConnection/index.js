import React, { useRef, useMemo } from "react";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as lh from "../../../../../../../../helpers/locationHelper";

import "./styles.css";

function LocConnection({ seed, loc, map, isMobileDevice }) {
  const type = useMemo(() => loc.data.reference.connectionType, [loc]);
  const angle = useMemo(() => loc.data.reference.connectionAngle, [loc]);
  const angleOrigin = useMemo(() => loc.data.reference.connectionAngleOrigin, [loc]);
  const height = useMemo(() => {
    if (!loc.data.exteriorLocationId || !map[loc.data.exteriorLocationId]) {
      return null;
    }

    return map[loc.data.exteriorLocationId].data.radius / 2;
  }, [loc.data.exteriorLocationId, map]);
  const conClipPath = useMemo(() => lh.GetLocConClipPaths(loc.data, seed), [loc.data, seed]);
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
      className={`LocConnection-container df df-fd-c${type === lc.LOCATION_CONNECTION_TYPES.PASSAGE ? " passage" : ""}${rotationOrigin}`}
      style={{ rotate: `${rotation * -1}deg` }}
    >
      <section style={{ height, backgroundColor: color.current, clipPath: conClipPath }}></section>
    </div>
  );
}

export default LocConnection;
