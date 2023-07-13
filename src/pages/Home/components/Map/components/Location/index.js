import React, { useState, useEffect, useMemo, useRef } from "react";
import * as utils from "../../../../../../utils";
import * as lc from "../../../../../../constants/locationConstants";
import * as cc from "../../../../../../constants/creatureConstants";
import * as lh from "../../../../../../helpers/locationHelper";

import "./styles.css";

function Location({
  loc,
  map,
  locations,
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
  const interiorLocs = useMemo(() => {
    const interiorLocs = Object.keys(loc.interiorLocs).filter((locId) => !map[locId].data.isHidden);
    const sortedRootLocs = lh.sortLocsByRef(interiorLocs.map((locId) => map[locId].data)).map((l) => l._id);
    return sortedRootLocs;
  }, [loc.interiorLocs, map]);
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
  const connectionStyle = useMemo(() => {
    if (!loc.data.reference.connectionType) {
      return null;
    }

    let connectionStyle = {
      rotate: `${loc.data.distanceAngle * -1}deg`,
      backgroundColor: lc.GetElementType(lc.GetLocationConnectionType(loc.data.reference.connectionType).elementType).color,
    };

    return connectionStyle;
  }, [loc.data]);
  const areaWrapperStyle = useMemo(() => {
    let radius = 0;
    areaLocs.forEach((l) => {
      radius += l.radius / 2;
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
      locationsRefs
        .filter((r) => map[r.id]?.data.offset)
        .forEach((r, i) => {
          //use y modifier in the calcs
          const value = r.offsetHeight + Math.abs(map[r.id].data.offset.y) * -1;

          if (i < index) {
            resetOffset -= value;
          } else if (i > index) {
            resetOffset += value;
          }
        });

      return resetOffset / 2;
    }

    let wrapperStyle = {};

    //hide render positioning
    if (!isMapRendered) {
      wrapperStyle.opacity = 0;
      return wrapperStyle;
    }

    wrapperStyle.translate = `0 ${GetResetOffset()}px`;

    return wrapperStyle;
  }, [isMapRendered, locationsRefs, map]);

  function GetAreaStyles(location, isPointOfInterest, index) {
    let radius = location.radius;
    areaLocs.slice(index + 1).forEach((l) => {
      radius += l.radius;
    });

    let areaStyles = {
      width: radius / 2,
      height: radius / 2,
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
    function GetLocDistFromCenterForCalc(loc) {
      const locEl = document.getElementById(
        loc.interiorLocs.length > 0 ? loc.interiorLocs.find((l) => !l.data.reference.location).data._id : loc.data._id
      );

      return locEl.offsetHeight / 2;
    }

    function GetOffset(location) {
      if (!location.reference.location || !map[location.reference.location]) {
        return { x: 0, y: 0 };
      } else {
        const refOffset = GetOffset(map[location.reference.location].data);
        //if refLoc has interiorLocs get radius(offsetHeight /2) from interiorLocs 1, otherwise from ref
        const refLocDistFromCenter = GetLocDistFromCenterForCalc(map[location.reference.location]);

        const distance = lh.GetNormalizedValue(location.distanceMultiplier, pxInMScale);

        //if loc has interiorLocs get radius(offsetHeight /2) from interiorLocs 1, otherwise from ref
        const locDistFromCenter = GetLocDistFromCenterForCalc(map[ref.current.id]);

        //offset is refLocDistFromCenter + distance + locDistFromCenter
        const coordinatesByDistance = utils.GetCoordinatesByDistance(
          refOffset,
          refLocDistFromCenter + distance + locDistFromCenter,
          location.distanceAngle
        );

        // console.log("GetOffset", location.name, "->", coordinatesByDistance, "->", refLoc.getAttribute("name"));
        return coordinatesByDistance;
      }
    }

    //set offset and position self
    if (!map[loc.data._id].data.offset) {
      map[loc.data._id].data.offset = GetOffset(loc.data);
      const offset = map[ref.current.id].data.offset;
      let connection = document.getElementById(`${loc.data._id}-connection`);

      //horizontal
      if (offset.x > 0) {
        ref.current.style.marginRight = `${offset.x * -1}px`;
        if (connection) {
          connection.style.marginLeft = `${(offset.x / 2) * -1}px`;
          // connection.style.width = `${offset.x / 2}px`;
        }
      } else {
        ref.current.style.marginLeft = `${offset.x}px`;
        if (connection) {
          connection.style.marginRight = `${offset.x / 2}px`;
          // connection.style.width = `${offset.x / 2}px`;
        }
      }

      //vertical
      if (offset.y > 0) {
        ref.current.style.marginTop = `${offset.y * -1}px`;
        if (connection) {
          connection.style.marginBottom = `${(offset.y / 2) * -1}px`;
          // connection.style.width = `${offset.y / 2}px`;
        }
      } else {
        ref.current.style.marginBottom = `${offset.y}px`;
        if (connection) {
          connection.style.marginTop = `${offset.y / 2}px`;
          // connection.style.width = `${offset.y / 2}px`;
        }
      }

      if (connection) {
        connection.style.width = `${Math.sqrt(offset.x * offset.x + offset.y * offset.y) / 2}px`;
      }
    }

    //update refs
    if (!allLocationsRefs.some((r) => r === ref.current)) {
      allLocationsRefs.push(ref.current);
      setAllLocationsRefs([...allLocationsRefs]);
    }

    if (!locationsRefs.some((r) => r === ref.current)) {
      locationsRefs.push(ref.current);
      setLocationsRefs([...locationsRefs]);
    }
  }, [allLocationsRefs, interiorLocs.length, loc.data, locationsRefs, map, pxInMScale, refs.length, setAllLocationsRefs, setLocationsRefs]);

  useEffect(() => {
    setAllLocationsRefs([]);
    setRefs([]);
  }, [locations, setAllLocationsRefs]);

  return (
    <div name={loc.data.name} ref={ref} id={loc.data._id} className={`Location-container ${className}`} style={wrapperStyle} key={rest.key}>
      {connectionStyle && <div id={`${loc.data._id}-connection`} className="connection" style={connectionStyle}></div>}
      {interiorLocs.length > 0 ? (
        interiorLocs.map((locationId) => (
          <Location
            loc={loc.interiorLocs[locationId]}
            map={map}
            locations={locations}
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
