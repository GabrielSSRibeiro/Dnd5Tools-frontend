import React from "react";

import Button from "../../../../components/Button";
import Select from "../../../../components/Select";
import LocationSummary from "./components/LocationSummary";

import "./styles.css";

function Map() {
  return (
    <div className="Map-container">
      <div className="world-map">
        <aside className="map-stats">
          <Select label="Horário" />
          <Select label="Viagem" />
          <Select label="Precipitação" />
          <Select label="Temperatura" />
        </aside>
        <aside className="map-zoom">
          <i class="fas fa-search"></i>
          <Select />
          <div className="move-zoom">
            <button>
              <i class="fas fa-caret-up"></i>
            </button>
            <button>
              <i class="fas fa-caret-left"></i>
            </button>
            <button>
              <i class="fas fa-circle"></i>
            </button>
            <button>
              <i class="fas fa-caret-right"></i>
            </button>
            <button>
              <i class="fas fa-caret-down"></i>
            </button>
          </div>
        </aside>
        <aside className="new-encounter">
          <Button text="Novo Encontro" />
        </aside>
        <div className="world-details">
          <LocationSummary location={"Mundo"} />
        </div>
      </div>
    </div>
  );
}

export default Map;
