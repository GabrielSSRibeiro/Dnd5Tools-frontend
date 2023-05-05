import React, { useState } from "react";
import * as lc from "../../../../constants/locationConstants";

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
  const [schedule, setSchedule] = useState(null);
  const [precipitation, setPrecipitation] = useState(null);
  const [temperature, setTemperature] = useState(null);

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

  return (
    <div className="Map-container">
      <div className="world-map">
        <aside className="map-stats">
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
        <aside className="map-zoom">
          <i class="fas fa-search"></i>
          <Select isDisabled={true} />
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
        <aside className="new-encounter">
          <Button text="Novo Encontro" isDisabled={true} />
        </aside>
        <div className="world-details">
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
        {locations.map((location, index) => (
          <div className="location" key={location._id}>
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
        ))}
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
