import React, { useState, useEffect, useMemo, useRef } from "react";
import * as lc from "../../../../../../constants/locationConstants";
import * as cc from "../../../../../../constants/creatureConstants";

import "./styles.css";

function Location({ loc, map, locationsRefs, setLocationsRefs, HandleHover, className = "", ...rest }) {
  const ref = useRef(null);
  const [refs, setRefs] = useState([]);
  const [wrapperStyle, setWrapperStyle] = useState({});
  const interiorLocs = useMemo(() => Object.keys(loc.interiorLocs), [loc]);
  const areaLocs = useMemo(() => {
    function AddAreaLoc(loc, areaLocs) {
      areaLocs.push(loc.data);

      //if exterior, add radius
      if (map[loc.data.exteriorLocationId]) {
        AddAreaLoc(map[loc.data.exteriorLocationId], areaLocs);
      }
    }

    let areaLocs = [];
    AddAreaLoc(loc, areaLocs);
    areaLocs.reverse();

    return areaLocs;
  }, [loc, map]);
  const areaWrapperStyle = useMemo(() => {
    let radius = 0;
    areaLocs.forEach((l) => {
      radius += l.radius;
    });

    let areaWrapperStyle = {
      width: radius,
      height: radius,
    };

    return areaWrapperStyle;
  }, [areaLocs]);

  function GetAreaStyles(location, isPointOfInterest, index) {
    let radius = location.radius;
    areaLocs.slice(index + 1).forEach((l) => {
      radius += l.radius;
    });

    let styles = {
      width: radius,
      height: radius,
      backgroundColor: isPointOfInterest ? lc.GetElementType(location.interaction.type).color : cc.GetEnviroment(location.traversal.type).color,
    };

    return styles;
  }

  function SetAsCurrent(location, isPointOfInterest) {
    if (isPointOfInterest && !location.interaction.isCurrent) {
      location.interaction.isCurrent = true;
    }
  }

  useEffect(() => {
    if (!locationsRefs.some((r) => r === ref.current)) {
      locationsRefs.push(ref.current);
      setLocationsRefs([...locationsRefs]);
    }
  }, [locationsRefs, setLocationsRefs]);

  useEffect(() => {
    function GetResetOffset() {
      let resetOffset = 0;

      const index = locationsRefs.findIndex((r) => r === ref.current);
      if (index < 0) {
        return resetOffset;
      }

      locationsRefs.forEach((r, i) => {
        if (i < index) {
          resetOffset -= r.offsetHeight;
        } else if (i > index) {
          resetOffset += r.offsetHeight;
        }
      });

      return resetOffset / 2;
    }

    function GetWrapperStyle() {
      //hide render positioning
      if (locationsRefs.length === 0) {
        return { opacity: 0 };
      }

      let resetOffset = GetResetOffset();

      //if first of area, the offset is just the reset
      if (!loc.data.reference.location) {
        return { translate: `0 ${resetOffset}px` };
      }

      //otherwise, offset X/Y is ref loc offsetWidth/height + dist + this loc offsetWidth/height
      const refLoc = locationsRefs.find((r) => r.id === loc.data.reference.location);
      let offset = refLoc.offsetWidth;

      //if the offset hasn't been set, there will be only one value for both x and y
      console.log("offset", refLoc.offsetWidth, refLoc.offsetHeight);
      if (offset.length === 2) {
        //  const refCenterOffset =  { bottom: 0, left: 0 }; //GetCenterOffset(refLoc, map);
        // const refOffset = lh.GetRefOffset(loc.data, refCenterOffset, refLoc.radius, pxInMScale);
        // const fafa =  { bottom: refCenterOffset.bottom + refOffset.bottom, left: refCenterOffset.left + refOffset.left };
      }

      return { translate: `0 ${resetOffset}px` };
    }

    setWrapperStyle(GetWrapperStyle());
  }, [loc.data.reference.location, locationsRefs, wrapperStyle.translate]);

  return (
    <div name={loc.data.name} ref={ref} id={loc.data._id} className={`Location-container ${className}`} style={wrapperStyle} key={rest.key}>
      {interiorLocs.length > 0 ? (
        interiorLocs.map((locationId) => (
          <Location
            loc={loc.interiorLocs[locationId]}
            map={map}
            locationsRefs={refs}
            setLocationsRefs={setRefs}
            HandleHover={HandleHover}
            key={locationId}
            {...rest}
          />
        ))
      ) : (
        <div className="area-wrapper" style={areaWrapperStyle}>
          {areaLocs.map((l, index) => {
            const isPointOfInterest = l.size === lc.LOCATION_SIZES.POINT_OF_INTEREST;

            return (
              <div
                className={`area${isPointOfInterest && !l.interaction.isCurrent ? " not-current" : ""}${
                  isPointOfInterest ? " point-of-interest" : ""
                }`}
                style={GetAreaStyles(l, isPointOfInterest, index)}
                onClick={() => SetAsCurrent(l, isPointOfInterest)}
                onMouseMove={(e) => HandleHover(e, l)}
                onMouseLeave={(e) => HandleHover(e)}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Location;
