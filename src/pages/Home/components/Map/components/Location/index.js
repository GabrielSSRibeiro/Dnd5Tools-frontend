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
  const interiorLocs = useMemo(() => Object.keys(loc.interiorLocs).filter((locId) => !map[locId].data.isHidden), [loc.interiorLocs, map]);
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
      if (!location.reference.location) {
        return { x: 0, y: 0 };
      } else {
        const refLoc = locationsRefs.find((r) => r.id === location.reference.location);
        const refOffset = GetOffset(map[refLoc.id].data);
        //if refLoc has interiorLocs get radius(offsetHeight /2) from interiorLocs 1, otherwise from ref
        const refLocDistFromCenter = GetLocDistFromCenterForCalc(map[refLoc.id]);

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

  useEffect(() => {
    setAllLocationsRefs([]);
    setRefs([]);
  }, [locations, setAllLocationsRefs]);

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
