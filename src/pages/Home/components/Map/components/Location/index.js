import React, { useState, useEffect, useMemo, useRef } from "react";
import * as utils from "../../../../../../utils";
import * as lc from "../../../../../../constants/locationConstants";
import * as cc from "../../../../../../constants/creatureConstants";
import * as lh from "../../../../../../helpers/locationHelper";

import LocConnection from "./components/LocConnection";

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
  travel,
  zoom,
  isMobileDevice,
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
      .find((l) => l.offset.x !== 0 || l.offset.y !== 0);

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

    return lh.GetLocRadiusForCalc(map[connectionLoc.reference.location], map);
  }, [connectionLoc, map]);
  const distanceAngle = useMemo(() => areaLocs.toReversed().find((l) => l.distanceAngle != null)?.distanceAngle, [areaLocs]);
  const areaWrapperStyle = useMemo(() => {
    let radius = 0;
    areaLocs.forEach((l) => {
      radius += l.radius / 2;
    });

    let areaWrapperStyle = {
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
  const connectionStyle = useMemo(() => {
    if (!loc.data.reference.connectionType) {
      return null;
    }

    if (loc.data.reference.connectionAngle && !loc.data.reference.connectionAngleOrigin) {
      return null;
    }

    let connectionStyle = {
      rotate: `${loc.data.distanceAngle * -1}deg`,
      zIndex: areaLocs.length,
    };

    return connectionStyle;
  }, [
    areaLocs.length,
    loc.data.distanceAngle,
    loc.data.reference.connectionAngle,
    loc.data.reference.connectionAngleOrigin,
    loc.data.reference.connectionType,
  ]);
  const areaLocsToRender = useMemo(
    () =>
      areaLocs.map((l, index) => {
        const isLocArea = index === areaLocs.length - 1;
        const isPointOfInterest = l.size === lc.LOCATION_SIZES.POINT_OF_INTEREST;
        const locType = isPointOfInterest ? lc.GetElementType(l.interaction.type) : cc.GetEnviroment(l.traversal.type);
        const hasConnectionBg = areaLocs.slice(index + 1).some((l) => l.reference.location && l.reference.distance && l.reference.direction);
        const areaStyles = lh.GetAreaStyles(l, index, isPointOfInterest, locType, areaLocs, map);
        let boxShadow = `20px 20px 500px ${locType?.shadowSpread ?? 0}px rgba(0,0,0,0.25)`;
        let conBgClipPath = lh.GetLocConBgClipPath(connectionLoc, l._id);

        //temp fix for performance issue with clip-path
        if (isMobileDevice) {
          areaStyles.clipPath = null;
          areaStyles.borderRadius = "100%";
          areaStyles.scale = "2";
          boxShadow = null;
          conBgClipPath = { top: null, bottom: null };
        }

        return { data: l, isLocArea, isPointOfInterest, hasConnectionBg, areaStyles, conBgClipPath, boxShadow };
      }),
    [areaLocs, connectionLoc, isMobileDevice, map]
  );

  function GetConnection(conDesc, conType, conDepth) {
    return {
      description: conDesc,
      type: conType,
      depth: conDepth,
    };
  }

  function GetConnectionStyles(connection) {
    let connectionStyles = {};

    const calcDist = lh.GetNormalizedValue(lc.GetReferenceDistance(connection.distance).baseDistanceMultiplier, pxInMScale) / 2;
    const { x, y } = utils.GetCoordinatesByDistance({ x: 0, y: 0 }, calcDist, lh.GetDistanceAngle(connection.direction));
    connectionStyles.width = calcDist;

    //horizontal
    if (x > 0) {
      connectionStyles.marginLeft = x;
    } else {
      connectionStyles.marginRight = x * -1;
    }

    //vertical
    if (y > 0) {
      connectionStyles.marginBottom = y;
    } else {
      connectionStyles.marginTop = y * -1;
    }

    return connectionStyles;
  }

  //main setup
  useEffect(() => {
    //set offset and position self
    let locOffset = map[ref.current.id].data.offset;
    if (!locOffset) {
      map[loc.data._id].data.offset = lh.GetOffset(loc.data, map, pxInMScale);
      locOffset = map[ref.current.id].data.offset;

      lh.GetOffsetStyles(locOffset).forEach((s) => {
        ref.current.style[s.key] = s.value;
      });
    }

    //set connection and bg
    if (connectionLoc?.offset && map[connectionLoc.reference.location].data.offset) {
      //set connection styles
      let connection = document.getElementById(`${loc.data._id}-connection`);
      if (connection && connection.classList.contains("not-flat")) {
        lh.GetConnectionOffsetStyles(connectionLoc, locOffset, map).forEach((s) => {
          connection.style[s.key] = s.value;
        });
      }

      //update backgrounds styles
      Array.from(document.getElementsByClassName(`${loc.data._id}-con-bg`))
        .filter((cbg) => cbg.classList.contains("not-flat"))
        .forEach((cbg, i, self) => {
          lh.GetConnectionBgOffsetStyles(cbg, i, self, connectionLoc, refAreaDiameter, map).forEach((s) => {
            cbg.style[s.key] = s.value;
          });
        });
    }

    //final movement and update width
    if (isMapRendered) {
      //move all interior locs to the world level so the index takes proper effect
      const flatContainer = document.getElementById("flat-locs");
      Array.from(ref.current.getElementsByClassName("not-flat")).forEach((nfEl) => {
        lh.GetFlatUpdateStyles(nfEl, ref, loc.data, map).forEach((s) => {
          nfEl.style[s.key] = s.value;
        });
        nfEl.classList.remove("not-flat");
        flatContainer.appendChild(nfEl);
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
      {/* connection */}
      {connectionStyle && (
        <div
          id={`${loc.data._id}-connection`}
          className="connection not-flat"
          style={connectionStyle}
          onMouseMove={(e) =>
            HandleHover(
              e,
              loc.data,
              null,
              GetConnection(loc.data.reference.connectionDescription, loc.data.reference.connectionType, loc.data.reference.connectionDepth)
            )
          }
          onMouseLeave={(e) => HandleHover(e)}
        >
          <LocConnection
            seed={loc.data.reference.connectionSeed ?? loc.data._id}
            distance={loc.data.reference.distance}
            type={loc.data.reference.connectionType}
            angle={loc.data.reference.connectionAngle}
            angleOrigin={loc.data.reference.connectionAngleOrigin}
            loc={loc}
            map={map}
            isMobileDevice={isMobileDevice}
          />
        </div>
      )}

      {/* connections */}
      {loc.data.connections.map((c, i) => (
        <div
          id={`${loc.data._id}-connection-${i}`}
          key={i}
          className="connection not-flat"
          style={{ rotate: `${lc.GetDirection(c.direction).baseAngle * -1}deg`, zIndex: areaLocs.length, ...GetConnectionStyles(c) }}
          onMouseMove={(e) => HandleHover(e, loc.data, null, GetConnection(c.description, c.connectionType, c.depth))}
          onMouseLeave={(e) => HandleHover(e)}
        >
          <LocConnection
            seed={c.seed}
            distance={c.distance}
            type={c.connectionType}
            angle={c.connectionAngle}
            angleOrigin={lh.GetConAngleOrigin(c.connectionAngleOrigin)}
            loc={loc}
            map={map}
            isMobileDevice={isMobileDevice}
          />
        </div>
      ))}

      {/* locations */}
      {interiorLocs.length > 0 ? (
        interiorLocs.map((locationId) => (
          <Location
            key={locationId}
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
            zoom={zoom}
            isMobileDevice={isMobileDevice}
            {...rest}
          />
        ))
      ) : (
        <div className="area-wrapper" style={areaWrapperStyle}>
          {areaLocsToRender.map((l, index) => (
            <React.Fragment key={l.data._id}>
              {/* connection Bg */}
              {l.hasConnectionBg && (
                <div
                  name={l.data._id}
                  className={`connection-background ${loc.data._id}-con-bg not-flat`}
                  style={{
                    height: l.areaStyles.height,
                    filter: l.areaStyles.filter,
                    boxShadow: l.boxShadow,
                    rotate: `${distanceAngle * -1}deg`,
                    zIndex: index,
                  }}
                  onMouseMove={(e) => HandleHover(e, l.data)}
                  onMouseLeave={(e) => HandleHover(e)}
                >
                  <aside
                    className="con-bg-area corner needs-adjust"
                    style={{
                      backgroundColor: l.areaStyles.backgroundColor,
                      clipPath: l.conBgClipPath.top,
                    }}
                  ></aside>
                  <aside
                    className="con-bg-area corner needs-adjust"
                    style={{ backgroundColor: l.areaStyles.backgroundColor, clipPath: l.conBgClipPath.bottom }}
                  ></aside>
                </div>
              )}
              {/* area */}
              <div
                name={`${l.data.name}-area`}
                id={l.isLocArea ? `${l.data._id}-area` : null}
                className={`area${l.isPointOfInterest ? " point-of-interest" : ""} not-flat`}
                style={{
                  width: l.areaStyles.width,
                  height: l.areaStyles.height,
                  borderRadius: l.areaStyles.borderRadius,
                  overflow: l.areaStyles.overflow,
                  boxShadow: l.boxShadow,
                  rotate: `${distanceAngle * (l.hasConnectionBg ? -1 : 1)}deg`,
                  zIndex: l.isPointOfInterest ? locations.length : index,
                }}
                onMouseMove={(e) => HandleHover(e, l.data)}
                onMouseLeave={(e) => HandleHover(e)}
              >
                <div className="inner-area" style={l.areaStyles}></div>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

export default Location;
