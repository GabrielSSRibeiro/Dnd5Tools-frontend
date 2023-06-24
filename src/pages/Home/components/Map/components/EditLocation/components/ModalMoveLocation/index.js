import React, { useState, useMemo } from "react";
import * as cc from "../../../../../../../../constants/creatureConstants";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as utils from "../../../../../../../../utils";

import Modal from "../../../../../../../../components/Modal";
import Select from "../../../../../../../../components/Select";
import CheckInput from "../../../../../../../../components/CheckInput";

import "./styles.css";

function ModalMoveLocation({ world, locations, onClose, onSelect }) {
  const [moveInteriorLocs, setMoveInteriorLocs] = useState(true);
  const [nameFilter, setNameFilter] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const filteredLocations = useMemo(() => {
    function filter() {
      let temp = locations;

      if (nameFilter) {
        temp = locations.filter((l) =>
          //if location name starts with filter
          l.name.toLowerCase().startsWith(nameFilter.toLowerCase())
        );
      }

      if (selectedSize) {
        temp = temp.filter((l) => l.size === selectedSize);
      }

      if (selectedType) {
        temp = temp.filter((l) => l.type === selectedType);
      }

      if (temp.length > 0) {
        utils.SortArrayOfObjByStringProperty(temp, "name");
      }

      return temp;
    }

    return filter();
  }, [locations, nameFilter, selectedSize, selectedType]);

  function HandleSelectSize(value) {
    if (
      value == null ||
      (selectedSize !== value && (selectedSize === lc.LOCATION_SIZES.POINT_OF_INTEREST || value === lc.LOCATION_SIZES.POINT_OF_INTEREST))
    ) {
      setSelectedType(null);
    }

    setSelectedSize(value);
  }

  function HandleSelect(newExteriorLocId) {
    onSelect(newExteriorLocId, moveInteriorLocs);
    onClose();
  }

  return (
    <Modal title="Mover Localização" className="ModalMoveLocation-container" onClickToClose={onClose}>
      <main className="content details-wrapper df df-fd-c df-jc-fs">
        <span className="warning-message">Mudanças não salvas na localização serão descartadas</span>
        <CheckInput
          label="Também mover localizações internas"
          onClick={() => setMoveInteriorLocs(!moveInteriorLocs)}
          isSelected={moveInteriorLocs}
          isDisabled={true}
        />

        <div className="location-filters">
          <div className="filter-text">
            <input onChange={(e) => setNameFilter(e.target.value)} placeholder="Nome de localização" value={nameFilter ?? ""}></input>
            <button onClick={() => setNameFilter("")}>LIMPAR</button>
          </div>
          <main>
            <Select
              extraWidth={65}
              value={selectedSize}
              onSelect={(value) => HandleSelectSize(value)}
              nothingSelected="Tamanho"
              options={lc.locationSizes}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              extraWidth={65}
              value={selectedType}
              onSelect={(value) => setSelectedType(value)}
              nothingSelected="Tipo"
              options={selectedSize === lc.LOCATION_SIZES.POINT_OF_INTEREST ? lc.elementTypes : cc.creatureEnvironments}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              isDisabled={!selectedSize}
            />
          </main>
        </div>
        <div className="location-list df df-fd-c df-jc-fs">
          {world && (
            <div className="list-location df df-jc-sb">
              <span>{world.name}</span>
              <button onClick={() => HandleSelect()}>
                <i class="fas fa-check"></i>
              </button>
            </div>
          )}
          {filteredLocations.map((loc) => (
            <div className="list-location df df-jc-sb" key={loc._id}>
              <span>{loc.name}</span>
              <button onClick={() => HandleSelect(loc._id)}>
                <i class="fas fa-check"></i>
              </button>
            </div>
          ))}
        </div>
      </main>
    </Modal>
  );
}

export default ModalMoveLocation;
