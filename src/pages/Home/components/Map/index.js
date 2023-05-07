import React, { useState, useMemo } from "react";
import * as lh from "../../../../helpers/locationHelper";
import * as lc from "../../../../constants/locationConstants";
import * as cc from "../../../../constants/creatureConstants";

import Button from "../../../../components/Button";
import Select from "../../../../components/Select";
import LocationSummary from "./components/LocationSummary";
import EditLocation from "./components/EditLocation";

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

  const pxInMScale = useMemo(() => lc.BASE_PX_IN_M_SCALE * lc.GetZoomLevel(zoomLevel).scaleMultiplier, [zoomLevel]);

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

  function SetAsCurrent(location, isPointOfInterest) {
    if (isPointOfInterest && !location.interaction.isCurrent) {
      location.interaction.isCurrent = true;
    }
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
            locations={locations}
            creatures={creatures}
            schedule={schedule}
            precipitation={precipitation}
            temperature={temperature}
          />
        </div>
        {locations.map((location) => {
          const radius = lh.GetRadius(location, pxInMScale);
          const visionRadius = lc.BASE_VISION_IN_M / pxInMScale;
          const isPointOfInterest = location.size === lc.LOCATION_SIZES.POINT_OF_INTEREST;

          let areaStyle = {
            width: radius,
            height: radius,
            backgroundColor: isPointOfInterest ? lc.GetElementType(location.interaction.type).color : cc.GetEnviroment(location.traversal.type).color,
          };

          return (
            <div className="location" key={location._id}>
              <div className="location-details">
                <div style={{ marginTop: radius }}>
                  <LocationSummary
                    location={location}
                    id={location._id}
                    setLocationToEdit={setLocationToEdit}
                    locations={locations}
                    creatures={creatures}
                    schedule={schedule}
                    precipitation={precipitation}
                    temperature={temperature}
                  />
                </div>
              </div>
              <div
                className={`area${isPointOfInterest && !location.interaction.isCurrent ? " not-current" : ""}${
                  isPointOfInterest ? " point-of-interest" : ""
                }`}
                style={areaStyle}
                onClick={() => SetAsCurrent(location, isPointOfInterest)}
              ></div>
              {location.interaction.isCurrent && <div className="vision" style={{ width: visionRadius, height: visionRadius }}></div>}
            </div>
          );
        })}
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
