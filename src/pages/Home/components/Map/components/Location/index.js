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
  const connectionLoc = useMemo(() => {
    if (!isMapRendered) {
      return null;
    }

    const connectionLoc = areaLocs
      .toReversed()
      .filter((l) => l.offset)
      .find((l) => l.offset.x !== 0 && l.offset.y !== 0);
    if (!connectionLoc) {
      return null;
    }

    return connectionLoc;
  }, [areaLocs, isMapRendered]);
  const refAreaDiameter = useMemo(() => {
    if (!connectionLoc) {
      return null;
    }

    return document.getElementById(`${connectionLoc.reference.location}-area`).offsetWidth;
  }, [connectionLoc]);
  const distanceAngle = useMemo(() => areaLocs.toReversed().find((l) => l.distanceAngle != null)?.distanceAngle, [areaLocs]);
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

  function GetOffsetStyles(offset, includeWidth = false) {
    const offsetStyles = [];

    if (includeWidth) {
      offsetStyles.push({ key: "width", value: `${Math.sqrt(offset.x * offset.x + offset.y * offset.y) / 2}px` });
    }

    //horizontal
    if (offset.x > 0) {
      offsetStyles.push({ key: "marginRight", value: `${offset.x * -1}px` });
    } else {
      offsetStyles.push({ key: "marginLeft", value: `${offset.x}px` });
    }

    //vertical
    if (offset.y > 0) {
      offsetStyles.push({ key: "marginTop", value: `${offset.y * -1}px` });
    } else {
      offsetStyles.push({ key: "marginBottom", value: `${offset.y}px` });
    }

    return offsetStyles;
  }

  function GetConnectionOffsetStyles(offset) {
    const offsetStyles = [{ key: "width", value: `${Math.sqrt(offset.x * offset.x + offset.y * offset.y) / 2}px` }];

    //horizontal
    if (offset.x > 0) {
      offsetStyles.push({ key: "marginLeft", value: `${(offset.x * -1) / 2}px` });
    } else {
      offsetStyles.push({ key: "marginRight", value: `${offset.x / 2}px` });
    }

    //vertical
    if (offset.y > 0) {
      offsetStyles.push({ key: "marginBottom", value: `${(offset.y * -1) / 2}px` });
    } else {
      offsetStyles.push({ key: "marginTop", value: `${offset.y / 2}px` });
    }

    return offsetStyles;
  }

  //main setup
  useEffect(() => {
    function GetLocDistFromCenterForCalc(location) {
      const locEl = document.getElementById(
        location.interiorLocs.length > 0 ? location.interiorLocs.find((l) => !l.data.reference.location).data._id : location.data._id
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
          (refLocDistFromCenter + distance + locDistFromCenter) * 2,
          location.distanceAngle
        );

        return coordinatesByDistance;
      }
    }

    //set offset and position self
    let locOffset = map[ref.current.id].data.offset;
    if (!locOffset) {
      map[loc.data._id].data.offset = GetOffset(loc.data);
      locOffset = map[ref.current.id].data.offset;

      GetOffsetStyles(locOffset).forEach((s) => {
        ref.current.style[s.key] = s.value;
      });
    }

    //set onnection styles
    let connection = document.getElementById(`${loc.data._id}-connection`);
    if (connection) {
      GetConnectionOffsetStyles(locOffset, true).forEach((s) => {
        connection.style[s.key] = s.value;
      });
    }

    function GetConnectionBgOffsetStyles(cbg, index, cbgs) {
      const offsetStyles = [];
      const { x, y } = connectionLoc.offset;

      const refHeightAdditor = cbgs.slice(index).reduce((acc, cur) => acc + map[cur.getAttribute("name")].data.radius / 2, 0);
      const isRefSmaller = cbg.offsetHeight > refAreaDiameter + refHeightAdditor;

      if (isRefSmaller) {
        //adjust height
        offsetStyles.push({ key: "height", value: `${refAreaDiameter + refHeightAdditor}px` });
      }

      Array.from(cbg.getElementsByClassName("con-bg-area corner")).forEach((bga) => {
        //adjust further
        if (isRefSmaller) {
          bga.style.width = `calc(100% + ${refAreaDiameter / 2}px)`;
          //adjust back
        } else if (index !== cbgs.length - 1) {
          const modifier = cbgs.slice(index + 2).reduce((acc, cur) => acc + map[cur.getAttribute("name")].data.radius / 2, 0);
          bga.style.width = `calc(100% - ${modifier / 2}px)`;
        }
      });

      const widthValue = Math.sqrt(x * x + y * y);
      const connectionRatio = (widthValue - refAreaDiameter) / widthValue;
      offsetStyles.push({ key: "width", value: `${(widthValue - refAreaDiameter) / 2}px` });

      //horizontal
      if (x > 0) {
        offsetStyles.push({ key: "marginLeft", value: `${(x * connectionRatio * -1) / 2}px` });
      } else {
        offsetStyles.push({ key: "marginRight", value: `${(x * connectionRatio) / 2}px` });
      }

      //vertical
      if (y > 0) {
        offsetStyles.push({ key: "marginBottom", value: `${(y * connectionRatio * -1) / 2}px` });
      } else {
        offsetStyles.push({ key: "marginTop", value: `${(y * connectionRatio) / 2}px` });
      }

      return offsetStyles;
    }

    //update backgrounds styles
    if (connectionLoc?.offset) {
      Array.from(document.getElementsByClassName(`con-bg-${loc.data._id}`)).forEach((cbg, i, self) => {
        GetConnectionBgOffsetStyles(cbg, i, self).forEach((s) => {
          cbg.style[s.key] = s.value;
        });
      });
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
  }, [
    allLocationsRefs,
    connectionLoc,
    interiorLocs.length,
    loc.data,
    locationsRefs,
    map,
    pxInMScale,
    refAreaDiameter,
    refs.length,
    setAllLocationsRefs,
    setLocationsRefs,
  ]);

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
            const isLocArea = index === areaLocs.length - 1;
            const areaStyles = GetAreaStyles(l, isPointOfInterest, index);
            const connectionAreaStyles = { backgroundColor: areaStyles.backgroundColor };

            return (
              <React.Fragment key={l._id}>
                {areaLocs[index + 1]?.reference.location && (
                  <div
                    name={l._id}
                    className={`connection-background con-bg-${loc.data._id}`}
                    style={{
                      height: areaStyles.height,
                      rotate: `${distanceAngle * -1}deg`,
                    }}
                    onMouseMove={(e) => HandleHover(e, l)}
                    onMouseLeave={(e) => HandleHover(e)}
                  >
                    <aside className="con-bg-area corner" style={connectionAreaStyles}></aside>
                    <aside className="con-bg-area" style={{ ...connectionAreaStyles, height: refAreaDiameter }}></aside>
                    <aside className="con-bg-area corner" style={connectionAreaStyles}></aside>
                  </div>
                )}
                <div
                  id={isLocArea && `${l._id}-area`}
                  className={`area${isPointOfInterest && !l.interaction.isCurrent ? " not-current" : ""}${
                    isPointOfInterest ? " point-of-interest" : ""
                  }`}
                  style={areaStyles}
                  onClick={() => SetAsCurrent(l, isPointOfInterest)}
                  onMouseMove={(e) => HandleHover(e, l)}
                  onMouseLeave={(e) => HandleHover(e)}
                ></div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Location;
