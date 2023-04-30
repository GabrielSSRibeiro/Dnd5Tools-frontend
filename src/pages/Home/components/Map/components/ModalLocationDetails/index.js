import React, { useState, useMemo } from "react";
import * as cc from "../../../../../../constants/creatureConstants";
import * as lc from "../../../../../../constants/locationConstants";
import * as utils from "../../../../../../utils";

import Modal from "../../../../../../components/Modal";
import Button from "../../../../../../components/Button";
import Select from "../../../../../../components/Select";

import "./styles.css";

function ModalLocationDetails({ location, locations, onClose, HandleEditLocation, creatures }) {
  const [nameFilter, setNameFilter] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(location.exteriorLocationId);

  const locationLevels = [{ display: "Internas", value: location.exteriorLocationId }];

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
      }

      if (temp.length > 0) {
        utils.SortArrayOfObjByStringProperty(temp, "name");
      }

      return temp;
    }

    return filter();
  }, [locations, nameFilter, selectedSize, selectedType, selectedLevel, creatures]);

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
                onSelect={(value) => setSelectedSize(value)}
                nothingSelected="Tamanho"
                options={lc.locationSizes}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                optionsAtATime={8}
              />
              <Select
                extraWidth={40}
                value={selectedType}
                onSelect={(value) => setSelectedType(value)}
                nothingSelected="Tipo"
                options={selectedSize ? cc.creatureEnvironments : lc.elementTypes}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                optionsAtATime={8}
              />
              <Select
                extraWidth={40}
                value={selectedLevel}
                onSelect={(value) => setSelectedLevel(value)}
                nothingSelected="Nível"
                options={locationLevels}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                optionsAtATime={8}
              />
            </main>
          </div>
          <div className="location-list df df-fd-c df-jc-fs">
            {filteredLocations.map((loc) => (
              <div className="list-location df df-jc-sb" key={loc._id}>
                <span>{loc.name}</span>
                <button onClick={() => HandleEditLocation(loc)}>
                  <i className="fas fa-pencil-alt"></i>
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
