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
      locationsRefs
        .filter((r) => map[r.id].data.offset)
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
        //if refLoc has interiorLocs, offset, otherwise radius
        const refLocRadius = 10000 / pxInMScale;

        const distance = lh.GetNormalizedValue(location.distanceMultiplier, pxInMScale);

        //if loc has interiorLocs, offset, otherwise radius
        const locRadius = 10000 / pxInMScale;

        //offset is locRadius + distance + refLocRadius
        const coordinatesByDistance = utils.GetCoordinatesByDistance(refOffset, locRadius + distance + refLocRadius, location.distanceAngle);

        // console.log("GetOffset", location.name, "->", coordinatesByDistance, "->", refLoc.getAttribute("name"));
        return coordinatesByDistance;
        // return { x: 0, y: 50 };
      }
    }

    if (refs.length !== interiorLocs.length) {
      return null;
    }

    //set offset and position self
    if (!map[loc.data._id].data.offset) {
      map[loc.data._id].data.offset = GetOffset(loc.data);
      if (map[ref.current.id].data.offset.x > 0) {
        ref.current.style.marginRight = `${map[ref.current.id].data.offset.x * -1}px`;
      } else {
        ref.current.style.marginLeft = `${map[ref.current.id].data.offset.x}px`;
      }

      if (map[ref.current.id].data.offset.y > 0) {
        ref.current.style.marginTop = `${map[ref.current.id].data.offset.y * -1}px`;
      } else {
        ref.current.style.marginBottom = `${map[ref.current.id].data.offset.y}px`;
      }
    }

    if (!allLocationsRefs.some((r) => r === ref.current)) {
      allLocationsRefs.push(ref.current);
      setAllLocationsRefs([...allLocationsRefs]);
    }

    if (!locationsRefs.some((r) => r === ref.current)) {
      locationsRefs.push(ref.current);
      setLocationsRefs([...locationsRefs]);
    }
  }, [allLocationsRefs, interiorLocs.length, loc.data, locationsRefs, map, pxInMScale, refs.length, setAllLocationsRefs, setLocationsRefs]);

  return (
    <div name={loc.data.name} ref={ref} id={loc.data._id} className={`Location-container ${className}`} style={wrapperStyle} key={rest.key}>
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
