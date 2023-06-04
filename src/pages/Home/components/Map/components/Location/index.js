import React, { useState, useEffect, useMemo, useRef } from "react";
import * as utils from "../../../../../../utils";
import * as lc from "../../../../../../constants/locationConstants";
import * as cc from "../../../../../../constants/creatureConstants";
import * as lh from "../../../../../../helpers/locationHelper";

import "./styles.css";

function Location({
  loc,
  map,
  pxInMScale,
  locationsRefs,
  setLocationsRefs,
  allLocationsRefs,
  setAllLocationsRefs,
  isMapRendered,
  HandleHover,
  className = "",
  ...rest
}) {
  const ref = useRef(null);
  const [refs, setRefs] = useState([]);
  const [canInteriorLocsBePositioned, setCanInteriorLocsBePositioned] = useState(false);
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
  const wrapperStyle = useMemo(() => {
    function GetResetOffset() {
      let resetOffset = 0;

      const index = locationsRefs.findIndex((r) => r === ref.current);
      locationsRefs.forEach((r, i) => {
        r.style.marginLeft = `${map[r.id].data.offset.x}px`;
        r.style.marginBottom = `${map[r.id].data.offset.y}px`;

        const modifier = r.style.marginBottom ? parseInt(r.style.marginBottom) : 0;

        if (i < index) {
          resetOffset -= r.offsetHeight + modifier;
        } else if (i > index) {
          resetOffset += r.offsetHeight + modifier;
        }
      });
      return resetOffset / 2;
    }

    //hide render positioning
    if (!isMapRendered || !canInteriorLocsBePositioned) {
      return { opacity: 0 };
    }

    let wrapperStyle = {};
    wrapperStyle.translate = `0 ${GetResetOffset()}px`;
    wrapperStyle.marginLeft = `${map[ref.current.id].data.offset.x}px`;
    wrapperStyle.marginBottom = `${map[ref.current.id].data.offset.y}px`;

    return wrapperStyle;
  }, [canInteriorLocsBePositioned, isMapRendered, locationsRefs, map]);

  function GetAreaStyles(location, isPointOfInterest, index) {
    let radius = location.radius;
    areaLocs.slice(index + 1).forEach((l) => {
      radius += l.radius;
    });

    let areaStyles = {
      width: radius,
      height: radius,
      backgroundColor: isPointOfInterest ? lc.GetElementType(location.interaction.type).color : cc.GetEnviroment(location.traversal.type).color,
    };

    return areaStyles;
  }

  function SetAsCurrent(location, isPointOfInterest) {
    if (isPointOfInterest && !location.interaction.isCurrent) {
      location.interaction.isCurrent = true;
    }
  }

  useEffect(() => {
    function GetOffset(location) {
      if (!location.reference.location) {
        return { x: 0, y: 0 };
      } else {
        const refLoc = locationsRefs.find((r) => r.id === location.reference.location);
        const refOffset = GetOffset(map[refLoc.id].data);
        //offset is ref loc offsetWidth/height + dist + this loc offsetWidth/height
        const distance =
          lh.GetNormalizedValue(location.distanceMultiplier, pxInMScale) +
          Math.sqrt(refLoc.offsetWidth * refLoc.offsetWidth + refLoc.offsetHeight * refLoc.offsetHeight);
        const coordinatesByDistance = utils.GetCoordinatesByDistance(refOffset, distance, location.distanceAngle);

        // console.log("GetOffset", location.name, "->", coordinatesByDistance, "->", refLoc.getAttribute("name"));
        return { x: 0, y: 100 }; //coordinatesByDistance;
      }
    }

    function CanInteriorLocsBePositioned() {
      if (refs.length === 0) {
        return true;
      }

      const canInteriorLocsBePositioned = refs.every((r) => map[r.id].data.offset);
      return canInteriorLocsBePositioned;
    }

    if (isMapRendered) {
      map[loc.data._id].data.offset = GetOffset(loc.data);
      setCanInteriorLocsBePositioned(CanInteriorLocsBePositioned());
    }
  }, [isMapRendered, loc.data, locationsRefs, map, pxInMScale, refs]);

  useEffect(() => {
    if (!locationsRefs.some((r) => r === ref.current)) {
      locationsRefs.push(ref.current);
      setLocationsRefs([...locationsRefs]);

      allLocationsRefs.push(ref.current);
      setAllLocationsRefs([...allLocationsRefs]);
    }
  }, [allLocationsRefs, locationsRefs, setAllLocationsRefs, setLocationsRefs]);

  return (
    <div name={loc.data.name} ref={ref} id={loc.data._id} className={`Location-container ${className}`} style={wrapperStyle} key={rest.key}>
      {interiorLocs.length > 0 ? (
        interiorLocs.map((locationId) => (
          <Location
            loc={loc.interiorLocs[locationId]}
            map={map}
            pxInMScale={pxInMScale}
            locationsRefs={refs}
            setLocationsRefs={setRefs}
            allLocationsRefs={allLocationsRefs}
            setAllLocationsRefs={setAllLocationsRefs}
            isMapRendered={isMapRendered}
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
                key={l._id}
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
