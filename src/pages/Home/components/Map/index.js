import React, { useState, useMemo } from "react";
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
  HandleDeleteLocation,
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
  const isMapRendered = useMemo(() => allLocationsRefs.length === locations.filter((l) => !l.isHidden).length, [allLocationsRefs.length, locations]);
  // const visionRadius = useMemo(() => lc.BASE_VISION_IN_M / pxInMScale, [pxInMScale]);

  const map = useMemo(() => {
    let map = {};
    locations
      .filter((l) => !l.isHidden)
      .map((location) => {
        //populate de obj in a flatten way
        map[location._id] = { data: location, interiorLocs: {} };
        return location;
      })
      .forEach((location, i) => {
        location.radius = lh.GetRadius(location, pxInMScale);
        location.offset = null;

        //for locs that are interior to others, add their ref
        if (map[location.exteriorLocationId]) {
          map[location.exteriorLocationId].interiorLocs[location._id] = map[location._id];
        }
      });

    return map;
  }, [locations, pxInMScale]);

  function HandleCancel() {
    setLocationToEdit(null);
  }

  function HandleSave(location) {
    HandleSaveLocation(location);
    setLocationToEdit(null);
  }

  function HandleDelete(location) {
    HandleDeleteLocation(location);
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

  return (
    <div className="Map-container">
      <div className="world-map" style={{ backgroundColor: cc.GetEnviroment(combatConfig.world.traversal.type).color }}>
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
        <div className="locations">
          {Object.keys(map)
            //only keep the exterior locs
            .filter((locationId) => !map[map[locationId].data.exteriorLocationId])
            .map((locationId) => {
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
                HandleDelete={locationToEdit.owner ? HandleDelete : null}
                FinishEditing={HandleCancel}
                HandleSelectFromBestiary={HandleSelectFromBestiary}
                setSelectedCreatures={setSelectedCreatures}
                creatures={creatures}
                locations={locations}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Map;
