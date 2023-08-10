import React, { useState, useEffect, useMemo } from "react";
import * as cc from "../../../../../../constants/creatureConstants";
import * as lc from "../../../../../../constants/locationConstants";
import * as utils from "../../../../../../utils";

import Modal from "../../../../../../components/Modal";
import Button from "../../../../../../components/Button";
import Select from "../../../../../../components/Select";

import "./styles.css";

function ModalLocationDetails({ location, id, locations, onClose, HandleEditNewLocation, OpenModalLocationDetails, HandleEditLocation, creatures }) {
  const [nameFilter, setNameFilter] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(id);

  const locationLevels = [{ display: "Internas", value: id }];

  const context = useMemo(() => {
    return location.contexts.find((c) => c.isCurrent);
  }, [location]);

  const filteredLocations = useMemo(() => {
    function filter() {
      let temp = locations;

      if (nameFilter) {
        temp = locations.filter(
          (l) =>
            //if location name starts with filter
            l.name.toLowerCase().startsWith(nameFilter.toLowerCase()) ||
            //if the name of any location creature starts with filter
            l.creatures.some((lc) =>
              creatures
                .find((c) => c._id === lc.creatureId)
                .name.toLowerCase()
                .startsWith(nameFilter.toLowerCase())
            )
        );
      }

      if (selectedSize) {
        temp = temp.filter((l) => l.size === selectedSize);
      }

      if (selectedType) {
        temp = temp.filter((l) => l.type === selectedType);
      }

      if (selectedLevel) {
        temp = temp.filter((l) => l.exteriorLocationId === selectedLevel);
      } else {
        temp = temp.filter((l) => l._id !== id);
      }

      if (temp.length > 0) {
        utils.SortArrayOfObjByStringProperty(temp, "name");
      }

      return temp;
    }

    return filter();
  }, [id, locations, nameFilter, selectedSize, selectedType, selectedLevel, creatures]);

  function HandleSelectSize(value) {
    if (
      value == null ||
      (selectedSize !== value && (selectedSize === lc.LOCATION_SIZES.POINT_OF_INTEREST || value === lc.LOCATION_SIZES.POINT_OF_INTEREST))
    ) {
      setSelectedType(null);
    }

    setSelectedSize(value);
  }

  function HandleNewLocation(locId) {
    HandleEditNewLocation(locId);
    onClose();
  }

  useEffect(() => {
    function resetFilters() {
      setNameFilter(null);
      setSelectedSize(null);
      setSelectedType(null);
      setSelectedLevel(id);
    }

    resetFilters();
  }, [id, location]);

  return (
    <Modal title={location.name} className="ModalLocationDetails-container df" onClickToClose={onClose}>
      <main className="content df df-ai-fs df-jc-sb df-f1">
        {context.details && (
          <aside className="details-wrapper df df-fd-c df-jc-fs">
            <h3>Detalhes</h3>
            <div className="details ">{context.details}</div>
          </aside>
        )}
        <aside className="details-wrapper df df-fd-c df-jc-fs">
          <h3>Localizações</h3>

          <div className="location-filters">
            <div className="filter-text">
              <input onChange={(e) => setNameFilter(e.target.value)} placeholder="Nome de localização ou criatura" value={nameFilter ?? ""}></input>
              <button onClick={() => setNameFilter("")}>LIMPAR</button>
            </div>
            <main>
              <Select
                extraWidth={40}
                value={selectedSize}
                onSelect={(value) => HandleSelectSize(value)}
                nothingSelected="Tamanho"
                options={lc.locationSizes}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
              <Select
                extraWidth={40}
                value={selectedType}
                onSelect={(value) => setSelectedType(value)}
                nothingSelected="Tipo"
                options={selectedSize === lc.LOCATION_SIZES.POINT_OF_INTEREST ? lc.elementTypes : cc.creatureEnvironments}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                isDisabled={!selectedSize}
              />
              <Select
                extraWidth={40}
                value={selectedLevel}
                onSelect={(value) => setSelectedLevel(value)}
                nothingSelected="Categoria"
                options={locationLevels}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
            </main>
          </div>
          <div className="location-list df df-fd-c df-jc-fs">
            {filteredLocations.map((loc) => (
              <div className="list-location df df-jc-sb" key={loc._id}>
                <button
                  title="Adicionar Dentro"
                  className={`${loc.size === lc.LOCATION_SIZES.POINT_OF_INTEREST ? "invisible" : ""}`}
                  onClick={() => HandleNewLocation(loc._id)}
                  disabled={locations.length >= 100 || loc.size === lc.LOCATION_SIZES.POINT_OF_INTEREST}
                >
                  <i className="fas fa-plus"></i>
                </button>
                <span>{loc.name}</span>
                <button title="Abrir Detalhes" onClick={() => OpenModalLocationDetails(loc, loc._id)}>
                  <i className="fas fa-book"></i>
                </button>
              </div>
            ))}
          </div>
        </aside>
      </main>
      <div className="divider"></div>
      <Button text="Editar" onClick={() => HandleEditLocation(location)} />
    </Modal>
  );
}

export default ModalLocationDetails;
