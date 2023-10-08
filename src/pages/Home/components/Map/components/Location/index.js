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
  GetLocRadiusForCalc,
  GetAllExteriorLocs,
  locationsRefs,
  setLocationsRefs,
  allLocationsRefs,
  setAllLocationsRefs,
  isMapRendered,
  HandleHover,
  className = "",
  travel,
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
  // const anyConnectionBg = useMemo(() => areaLocs.some((_, index) => areaLocs[index + 1]?.reference.location), [areaLocs]);
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
  const isAdjacent = useMemo(() => {
    if (!connectionLoc) {
      return false;
    }

    return connectionLoc.reference.distance === lc.REFERENCE_DISTANCES.ADJACENT;
  }, [connectionLoc]);
  const refAreaDiameter = useMemo(() => {
    if (!connectionLoc) {
      return null;
    }

    return GetLocRadiusForCalc(map[connectionLoc.reference.location]);
  }, [GetLocRadiusForCalc, connectionLoc, map]);
  const distanceAngle = useMemo(() => areaLocs.toReversed().find((l) => l.distanceAngle != null)?.distanceAngle, [areaLocs]);
  const connectionStyle = useMemo(() => {
    if (!loc.data.reference.connectionType) {
      return null;
    }

    let connectionStyle = {
      rotate: `${loc.data.distanceAngle * -1}deg`,
      backgroundColor: lc.GetElementType(lc.GetLocationConnectionType(loc.data.reference.connectionType).elementType).color,
      zIndex: areaLocs.length,
    };

    return connectionStyle;
  }, [areaLocs.length, loc.data.distanceAngle, loc.data.reference.connectionType]);
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

    map[loc.data._id].data.resetOffset = GetResetOffset();
    wrapperStyle.translate = `0 ${map[loc.data._id].data.resetOffset}px`;

    return wrapperStyle;
  }, [isMapRendered, loc.data._id, locationsRefs, map]);

  function GetAreaStyles(location, index, isLocArea, isPointOfInterest) {
    let radius = location.radius;
    areaLocs.slice(index + 1).forEach((l) => {
      radius += l.radius;
    });

    //add contrast with type equal to parent but diffrent than grand parent
    const parentLoc = map[location.exteriorLocationId]?.data;
    const grandParentLoc = parentLoc ? map[parentLoc.exteriorLocationId]?.data : null;
    const filterValue =
      location.traversal.type === parentLoc?.traversal.type && location.traversal.type !== grandParentLoc?.traversal.type ? 0.75 : 1;

    let areaStyles = {
      width: radius / 2,
      height: radius / 2,
      backgroundColor: isPointOfInterest ? lc.GetElementType(location.interaction.type)?.color : cc.GetEnviroment(location.traversal.type)?.color,
      filter: `contrast(${filterValue})`,
      borderRadius: "100%",
    };

    // if (anyConnectionBg && !isLocArea && connectionLoc && isAdjacent && connectionLoc._id !== location._id) {
    //   let modifier = 0;
    //   const areas = areaLocs.toReversed();
    //   const areaAndExterior = areas.slice(areas.findIndex((l) => l._id === connectionLoc._id) + 1).toReversed();
    //   const areasToSubtract = areaAndExterior.slice(areaAndExterior.findIndex((l) => l._id === location._id));
    //   areasToSubtract.forEach((l) => {
    //     modifier += l.radius / 2;
    //   });

    //   areaStyles.marginRight = modifier * -1;
    // }

    return areaStyles;
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

  //main setup
  useEffect(() => {
    function GetOffset(location) {
      if (!location.reference.location || !map[location.reference.location]) {
        return { x: 0, y: 0 };
      } else {
        const refOffset = GetOffset(map[location.reference.location].data);

        const refLocDistFromCenter = GetLocRadiusForCalc(map[location.reference.location]);

        const locDistFromCenter = GetLocRadiusForCalc(map[location._id]);

        //distance will be the largest between calc dist and all bg area radius
        const distance = lh.GetNormalizedValue(location.distanceMultiplier, pxInMScale);
        // let distance = calcDist;
        // if (location.reference.distance !== lc.REFERENCE_DISTANCES.ADJACENT) {
        //   distance = Math.max(calcDist, areaWrapperStyle.width - locDistFromCenter);
        // }

        const offsetDistance = refLocDistFromCenter + distance + locDistFromCenter;

        const coordinatesByDistance = utils.GetCoordinatesByDistance(refOffset, offsetDistance, location.distanceAngle);

        return { ...coordinatesByDistance, distance: offsetDistance };
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

    function GetConnectionOffsetStyles(offset) {
      let { x, y, distance } = offset;

      //remove the ref offset from x and y, making it the new center for the dist
      x -= map[connectionLoc.reference.location].data.offset.x;
      y -= map[connectionLoc.reference.location].data.offset.y;

      const offsetStyles = [{ key: "width", value: `${distance / 2}px` }];

      //horizontal
      if (x > 0) {
        offsetStyles.push({ key: "marginLeft", value: `${(x * -1) / 2}px` });
      } else {
        offsetStyles.push({ key: "marginRight", value: `${x / 2}px` });
      }

      //vertical
      if (y > 0) {
        offsetStyles.push({ key: "marginBottom", value: `${(y * -1) / 2}px` });
      } else {
        offsetStyles.push({ key: "marginTop", value: `${y / 2}px` });
      }

      return offsetStyles;
    }

    function GetConnectionBgOffsetStyles(cbg, index, cbgs) {
      const offsetStyles = [];

      let { x, y, distance } = connectionLoc.offset;

      //remove the ref offset from x and y, making it the new center for the dist
      x -= map[connectionLoc.reference.location].data.offset.x;
      y -= map[connectionLoc.reference.location].data.offset.y;

      const refHeightAdditor = cbgs.slice(index).reduce((acc, cur) => acc + map[cur.getAttribute("name")].data.radius / 2, 0);
      const isRefSmaller = cbg.offsetHeight > refAreaDiameter + refHeightAdditor;

      if (isRefSmaller) {
        //adjust height
        offsetStyles.push({ key: "height", value: `${refAreaDiameter + refHeightAdditor}px` });
      }

      Array.from(cbg.getElementsByClassName("con-bg-area")).forEach((bga) => {
        if (bga.classList.contains("needs-adjust")) {
          const isCorner = bga.classList.contains("corner");

          //adjust further
          if (isRefSmaller && isCorner) {
            bga.style.width = `calc(100% + ${refAreaDiameter / 2}px)`;
          }
          //adjust back if not last
          else if (index !== cbgs.length - 1) {
            //control how much should be adjusted by the ref size
            const sliceIndex = refAreaDiameter > connectionLoc.radius / 2 ? index + 1 : index + 2;

            const modifier = cbgs.slice(sliceIndex).reduce((acc, cur) => acc + map[cur.getAttribute("name")].data.radius / 2, 0);
            bga.style.width = `calc(100% - ${modifier / 2}px)`;
          }
          //still adjust further as last option
          else if (isCorner) {
            bga.style.width = `calc(100% + ${refAreaDiameter / 2}px)`;
          }

          bga.classList.remove("needs-adjust");
        }
      });

      const connectionRatio = (distance - refAreaDiameter) / distance;
      offsetStyles.push({ key: "width", value: `${(distance - refAreaDiameter) / 2}px` });

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

    if (connectionLoc?.offset) {
      //set connection styles
      let connection = document.getElementById(`${loc.data._id}-connection`);
      if (connection && connection.classList.contains("not-flat")) {
        GetConnectionOffsetStyles(locOffset).forEach((s) => {
          connection.style[s.key] = s.value;
        });
      }

      //update backgrounds styles
      Array.from(document.getElementsByClassName(`con-bg-${loc.data._id}`))
        .filter((cbg) => cbg.classList.contains("not-flat"))
        .forEach((cbg, i, self) => {
          GetConnectionBgOffsetStyles(cbg, i, self).forEach((s) => {
            cbg.style[s.key] = s.value;
          });
        });
    }

    function GetFlatUpdateStyles(nfel) {
      const flatUpdateStyles = [];
      let marginTop = ref.current.style.marginTop ? parseInt(ref.current.style.marginTop) : 0;
      let marginRight = ref.current.style.marginRight ? parseInt(ref.current.style.marginRight) : 0;
      let marginBottom = ref.current.style.marginBottom ? parseInt(ref.current.style.marginBottom) : 0;
      let marginLeft = ref.current.style.marginLeft ? parseInt(ref.current.style.marginLeft) : 0;

      GetAllExteriorLocs(loc.data)
        .map((l) => document.getElementById(l.data._id))
        .forEach((el) => {
          marginTop += el.style.marginTop ? parseInt(el.style.marginTop) : 0;
          marginRight += el.style.marginRight ? parseInt(el.style.marginRight) : 0;
          marginBottom += el.style.marginBottom ? parseInt(el.style.marginBottom) : 0;
          marginLeft += el.style.marginLeft ? parseInt(el.style.marginLeft) : 0;
        });

      marginTop += nfel.style.marginTop ? parseInt(nfel.style.marginTop) : 0;
      marginRight += nfel.style.marginRight ? parseInt(nfel.style.marginRight) : 0;
      marginBottom += nfel.style.marginBottom ? parseInt(nfel.style.marginBottom) : 0;
      marginLeft += nfel.style.marginLeft ? parseInt(nfel.style.marginLeft) : 0;

      flatUpdateStyles.push({ key: "marginTop", value: `${marginTop}px` });
      flatUpdateStyles.push({ key: "marginRight", value: `${marginRight}px` });
      flatUpdateStyles.push({ key: "marginBottom", value: `${marginBottom}px` });
      flatUpdateStyles.push({ key: "marginLeft", value: `${marginLeft}px` });

      return flatUpdateStyles;
    }

    //final movement and update final width
    if (isMapRendered) {
      //move all interior locs to the world level so the index takes proper effect
      const flatContainer = document.getElementById("flat-locs");
      Array.from(ref.current.getElementsByClassName("not-flat")).forEach((nfel) => {
        GetFlatUpdateStyles(nfel).forEach((s) => {
          nfel.style[s.key] = s.value;
        });
        nfel.classList.remove("not-flat");
        flatContainer.appendChild(nfel);
      });

      ref.current.style.width = "0px";
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
    GetAllExteriorLocs,
    GetLocRadiusForCalc,
    allLocationsRefs,
    areaLocs,
    areaWrapperStyle.height,
    areaWrapperStyle.width,
    connectionLoc,
    interiorLocs.length,
    isAdjacent,
    isMapRendered,
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
    <div
      name={loc.data.name}
      ref={ref}
      id={loc.data._id}
      className={`Location-container ${className}`}
      style={wrapperStyle}
      onClick={travel}
      key={rest.key}
    >
      {connectionStyle && (
        <div
          id={`${loc.data._id}-connection`}
          className="connection not-flat"
          style={connectionStyle}
          onMouseMove={(e) => HandleHover(e, loc.data)}
          onMouseLeave={(e) => HandleHover(e)}
        ></div>
      )}
      {interiorLocs.length > 0 ? (
        interiorLocs.map((locationId) => (
          <Location
            loc={loc.interiorLocs[locationId]}
            map={map}
            locations={locations}
            pxInMScale={pxInMScale}
            GetLocRadiusForCalc={GetLocRadiusForCalc}
            GetAllExteriorLocs={GetAllExteriorLocs}
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
            const isLocArea = index === areaLocs.length - 1;
            const isPointOfInterest = l.size === lc.LOCATION_SIZES.POINT_OF_INTEREST;
            const hasConnectionBg = areaLocs.slice(index + 1).some((l) => l.reference.location);
            let areaStyles = GetAreaStyles(l, index, isLocArea, isPointOfInterest, hasConnectionBg);
            let connectionAreaStyles = { backgroundColor: areaStyles.backgroundColor, filter: areaStyles.filter };

            return (
              <React.Fragment key={l._id}>
                {hasConnectionBg && (
                  <div
                    name={l._id}
                    className={`connection-background con-bg-${loc.data._id} not-flat`}
                    style={{
                      backgroundColor: areaStyles.backgroundColor,
                      filter: areaStyles.filter,
                      height: areaStyles.height,
                      rotate: `${distanceAngle * -1}deg`,
                      zIndex: index,
                    }}
                    onMouseMove={(e) => HandleHover(e, l)}
                    onMouseLeave={(e) => HandleHover(e)}
                  >
                    <aside className="con-bg-area corner needs-adjust" style={connectionAreaStyles}></aside>
                    {/* <aside className="con-bg-area corner needs-adjust" style={connectionAreaStyles}></aside>
                    <aside className="con-bg-area needs-adjust" style={{ ...connectionAreaStyles, height: refAreaDiameter }}></aside>
                    <aside className="con-bg-area corner needs-adjust" style={connectionAreaStyles}></aside> */}
                  </div>
                )}
                <div
                  name={`${l.name}-area`}
                  id={isLocArea ? `${l._id}-area` : null}
                  className={`area${isPointOfInterest ? " point-of-interest" : ""} not-flat`}
                  style={{
                    width: areaStyles.width,
                    height: areaStyles.height,
                    rotate: `${distanceAngle * -1}deg`,
                    zIndex: isPointOfInterest ? locations.length : index,
                  }}
                  onMouseMove={(e) => HandleHover(e, l)}
                  onMouseLeave={(e) => HandleHover(e)}
                >
                  <div style={areaStyles}></div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Location;
