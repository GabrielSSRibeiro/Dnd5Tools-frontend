import React, { useState, useEffect, useMemo } from "react";
import * as lh from "../../../../helpers/locationHelper";
import * as lc from "../../../../constants/locationConstants";
import * as cc from "../../../../constants/creatureConstants";

import Button from "../../../../components/Button";
import Select from "../../../../components/Select";
import LocationSummary from "./components/LocationSummary";
import EditLocation from "./components/EditLocation";
import Location from "./components/Location";

import "./styles.css";

function Map({
  HandleSaveLocation,
  HandleUpdateLocations,
  HandleDeleteLocations,
  HandleSelectFromBestiary,
  setSelectedCreatures,
  creatures,
  combatConfig,
  locations,
  userId,
}) {
  const [locationToEdit, setLocationToEdit] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(lc.ZOOM_LEVELS.DAY);
  const [schedule, setSchedule] = useState(null);
  const [precipitation, setPrecipitation] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [locHoverData, setLocHoverData] = useState(null);
  const [locationsRefs, setLocationsRefs] = useState([]);
  const [allLocationsRefs, setAllLocationsRefs] = useState([]);

  const pxInMScale = useMemo(() => lc.BASE_PX_IN_M_SCALE * lc.GetZoomLevel(zoomLevel).scaleMultiplier, [zoomLevel]);
  const locationsContainerId = useMemo(() => `all-${userId}-locations`, [userId]);
  // const visionRadius = useMemo(() => lc.BASE_VISION_IN_M / pxInMScale, [pxInMScale]);
  const map = useMemo(() => {
    let map = {};
    locations
      .map((location) => {
        //populate the obj in a flatten way
        map[location._id] = { data: location, interiorLocs: {} };
        return location;
      })
      .forEach((location, i) => {
        location.radius = lh.GetRadius(location, pxInMScale);
        location.offset = null;
        location.resetOffset = null;

        //for locs that are interior to others, add their ref
        if (map[location.exteriorLocationId]) {
          map[location.exteriorLocationId].interiorLocs[location._id] = map[location._id];
        }
      });

    return map;
  }, [locations, pxInMScale]);
  const rootLocs = useMemo(
    () =>
      Object.keys(map)
        //only keep the exterior locs
        .filter((locationId) => !map[locationId].data.isHidden && !map[map[locationId].data.exteriorLocationId]),
    [map]
  );
  const isMapRendered = useMemo(() => {
    let totalLocsToRender = 0;

    const countLocsToRender = (loc) => {
      totalLocsToRender++;
      Object.values(loc.interiorLocs)
        .filter((l) => !l.data.isHidden)
        .forEach((il) => {
          countLocsToRender(il);
        });
    };

    rootLocs.forEach((locId) => {
      countLocsToRender(map[locId]);
    });

    return allLocationsRefs.length === totalLocsToRender;
  }, [allLocationsRefs.length, map, rootLocs]);

  function HandleCancel() {
    setLocationToEdit(null);
  }

  function HandleSave(location) {
    if (map[location._id]) {
      allLocationsRefs.forEach((r) => {
        r.style.opacity = 0;
      });
    }

    HandleSaveLocation(location);
    setLocationToEdit(null);
  }

  async function HandleMove(location, newExteriorLocId, moveInteriorLocs) {
    if (map[location._id]) {
      allLocationsRefs.forEach((r) => {
        r.style.opacity = 0;
      });
    }

    let locToMoveUpdate = [
      {
        field: "exteriorLocationId",
        value: newExteriorLocId,
      },
      {
        field: "reference",
        value: { distance: null, direction: null, location: null, connectionType: null },
      },
    ];

    //is the new is in the root or is it has at least one not hidden loc, make the loc to move hidden
    if (!map[newExteriorLocId] || Object.keys(map[newExteriorLocId].interiorLocs).filter((il) => !il.isHidden).length > 0) {
      locToMoveUpdate.push({
        field: "isHidden",
        value: true,
      });
    } else {
      locToMoveUpdate.push({
        field: "isHidden",
        value: false,
      });
    }

    let updateLocationsReq = {
      ids: [location._id],
      updates: [locToMoveUpdate],
    };

    if (!moveInteriorLocs) {
      //this still needs work, like making then hidden since the first of area would be a problem
      // let interiorLocs = GetAllInteriorLocs(location);
      // interiorLocs.forEach((il) => {
      //   updateLocationsReq.ids.push(il.data._id);
      //   updateLocationsReq.updates.push({ field: "exteriorLocationId", value: location.exteriorLocationId });
      // });
    }

    let refLocs = GetAllRefLocs(location);
    refLocs.forEach((rl) => {
      //if loc to move has a ref, update its refs to have that ref instead, otherwize, clear it
      if (location.reference.location) {
        updateLocationsReq.ids.push(rl.data._id);
        updateLocationsReq.updates.push([
          {
            field: "reference.location",
            value: location.reference.location,
          },
        ]);
      } else {
        updateLocationsReq.ids.push(rl.data._id);
        let update = [
          {
            field: "reference",
            value: { distance: null, direction: null, location: null, connectionType: null },
          },
        ];

        //sice they all won't have a ref, they need to be hidden if more than one
        if (refLocs.length > 1) {
          update.push({
            field: "isHidden",
            value: true,
          });
        }

        updateLocationsReq.updates.push(update);
      }
    });

    await HandleUpdateLocations(updateLocationsReq);
    setLocationToEdit(null);
  }

  async function HandleDelete(location, deleteInteriorLocs) {
    if (map[location._id]) {
      allLocationsRefs.forEach((r) => {
        r.style.opacity = 0;
      });
    }

    let updateLocationsReq = { ids: [], updates: [] };
    let idsToDelete = [location._id];

    let interiorLocs = GetAllInteriorLocs(location);
    if (deleteInteriorLocs) {
      idsToDelete = [...idsToDelete, ...interiorLocs.map((l) => l.data._id)];
    } else {
      //this still needs work, like making then hidden since the first of area would be a problem
      // interiorLocs.forEach((il) => {
      //   updateLocationsReq.ids.push(il.data._id);
      //   updateLocationsReq.updates.push({ field: "exteriorLocationId", value: location.exteriorLocationId });
      // });
    }

    let refLocs = GetAllRefLocs(location);
    refLocs.forEach((rl) => {
      //if loc to delete has a ref, update its refs to have that ref instead, otherwize, clear it
      if (location.reference.location) {
        updateLocationsReq.ids.push(rl.data._id);
        updateLocationsReq.updates.push([
          {
            field: "reference.location",
            value: location.reference.location,
          },
        ]);
      } else {
        updateLocationsReq.ids.push(rl.data._id);
        let update = [
          {
            field: "reference",
            value: { distance: null, direction: null, location: null, connectionType: null },
          },
        ];

        //sice they all won't have a ref, they need to be hidden if more than one
        if (refLocs.length > 1) {
          update.push({
            field: "isHidden",
            value: true,
          });
        }

        updateLocationsReq.updates.push(update);
      }
    });

    await HandleUpdateLocations(updateLocationsReq);
    await HandleDeleteLocations(idsToDelete);
    setLocationToEdit(null);
  }

  let timer = null;
  function HandleLocHover(e, location) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (location) {
        setLocHoverData({ top: e.clientY, left: e.clientX, location });
      }
    }, 500);
  }

  function GetAllInteriorLocs(location) {
    function AddInteriorLocsToList(loc, list) {
      Object.values(loc.interiorLocs).forEach((l) => {
        list.push(l);
        AddInteriorLocsToList(l, list);
      });
    }

    let interiorLocs = [];
    AddInteriorLocsToList(map[location._id], interiorLocs);

    return interiorLocs;
  }

  function GetAllRefLocs(location) {
    const refLocs = (map[location.exteriorLocationId] ? Object.values(map[location.exteriorLocationId].interiorLocs) : Object.values(map)).filter(
      (l) => l.data.reference.location === location._id
    );

    return refLocs;
  }

  useEffect(() => {
    setAllLocationsRefs([]);
    setLocationsRefs([]);
  }, [locations]);

  return (
    <div className="Map-container">
      <div className="world-map" style={{ backgroundColor: cc.GetEnviroment(combatConfig.world.traversal.type).color }}>
        {locations.length === 0 ? (
          <aside className="info-msg floating-details">
            <h4>Adicione uma nova localização para vê-la no mapa</h4>
          </aside>
        ) : (
          !locations.some((l) => l.size === lc.LOCATION_SIZES.POINT_OF_INTEREST) && (
            <aside className="info-msg floating-details">
              <h4>Adicione pelo menos uma localização ponto de interesse para fazer jornadas</h4>
            </aside>
          )
        )}
        <aside className="map-stats floating-details">
          <Select
            label="Horário"
            isDisabled={true}
            value={schedule}
            onSelect={setSchedule}
            options={lc.routineSchedules}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
          />
          <Select label="Viagem" isDisabled={true} />
          <Select
            label="Precipitação"
            isDisabled={true}
            value={precipitation}
            onSelect={setPrecipitation}
            options={lc.precipitationFrequencies}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
          />
          <Select
            label="Temperatura"
            isDisabled={true}
            value={temperature}
            onSelect={setTemperature}
            options={lc.intenseTemperatureFrequencies}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
          />
        </aside>
        <aside className="map-zoom floating-details">
          <i class="fas fa-search"></i>
          <Select
            isDisabled={true}
            value={zoomLevel}
            onSelect={setZoomLevel}
            options={lc.zoomLevels}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
          />
          <div className="move-zoom">
            <button disabled>
              <i class="fas fa-caret-up"></i>
            </button>
            <button disabled>
              <i class="fas fa-caret-left"></i>
            </button>
            <button disabled>
              <i class="fas fa-circle"></i>
            </button>
            <button disabled>
              <i class="fas fa-caret-right"></i>
            </button>
            <button disabled>
              <i class="fas fa-caret-down"></i>
            </button>
          </div>
          <div className="compass">N</div>
        </aside>
        <aside className="new-encounter floating-details">
          <Button text="Novo Encontro" isDisabled={true} />
        </aside>
        <div className="world-details floating-details">
          <LocationSummary
            location={combatConfig.world}
            id={userId}
            setLocationToEdit={setLocationToEdit}
            setLocHoverData={setLocHoverData}
            locations={locations}
            creatures={creatures}
            schedule={schedule}
            precipitation={precipitation}
            temperature={temperature}
          />
        </div>
        {locHoverData && (
          <div
            className="location-details floating-details"
            style={{ top: locHoverData.top, left: locHoverData.left }}
            onMouseLeave={() => setLocHoverData(null)}
          >
            <div className="wrapper">
              <LocationSummary
                location={locHoverData.location}
                id={locHoverData.location._id}
                setLocationToEdit={setLocationToEdit}
                setLocHoverData={setLocHoverData}
                locations={locations}
                creatures={creatures}
                schedule={schedule}
                precipitation={precipitation}
                temperature={temperature}
              />
            </div>
          </div>
        )}
        {/* <hr className="test-center"></hr> */}
        <div id={locationsContainerId} className="locations">
          {rootLocs.map((locationId) => {
            return (
              <Location
                loc={map[locationId]}
                map={map}
                locations={locations}
                pxInMScale={pxInMScale}
                locationsRefs={locationsRefs}
                setLocationsRefs={setLocationsRefs}
                allLocationsRefs={allLocationsRefs}
                setAllLocationsRefs={setAllLocationsRefs}
                isMapRendered={isMapRendered}
                HandleHover={HandleLocHover}
                key={locationId}
              />
            );
          })}
        </div>
        {locationToEdit && (
          <>
            <div className="edit-blocker"></div>
            <div className="edit-location">
              <EditLocation
                locationToEdit={locationToEdit}
                HandleSave={HandleSave}
                HandleMove={HandleMove}
                HandleDelete={locationToEdit.owner ? HandleDelete : null}
                FinishEditing={HandleCancel}
                HandleSelectFromBestiary={HandleSelectFromBestiary}
                setSelectedCreatures={setSelectedCreatures}
                creatures={creatures}
                locations={locations}
                world={combatConfig.world}
                map={map}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Map;
