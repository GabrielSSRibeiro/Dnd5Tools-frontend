import React, { useState, useEffect, useMemo } from "react";
import * as cc from "../../../../../../constants/creatureConstants";
import * as lc from "../../../../../../constants/locationConstants";
import * as utils from "../../../../../../utils";

import Modal from "../../../../../../components/Modal";
import Button from "../../../../../../components/Button";
import Select from "../../../../../../components/Select";

import "./styles.css";

function ModalLocationDetails({
  location,
  map,
  id,
  defaultLevel,
  locations,
  onClose,
  HandleEditNewLocation,
  OpenModalLocationDetails,
  HandleEditLocation,
  creatures,
}) {
  const [nameFilter, setNameFilter] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const locationLevels = [{ display: "Internas", value: id }];

  const context = useMemo(() => {
    return location.contexts.find((c) => c.isCurrent);
  }, [location]);

  const contextData = useMemo(() => {
    let contextData = [];

    contextData.push({ label: "Primeiras Impressoes", icon: "fas fa-eye", value: context.firstImpressions ? context.firstImpressions : "..." });
    contextData.push({ label: "Geral", icon: "fas fa-info-circle", value: context.details ? context.details : "..." });
    contextData.push({ label: "Rumores", icon: "fas fa-assistive-listening-systems", value: context.rumors ? context.rumors : "..." });
    contextData.push({ label: "Segredos", icon: "fas fa-mask", value: context.secrets ? context.secrets : "..." });

    return contextData;
  }, [context]);

  const filteredLocations = useMemo(() => {
    function filter() {
      let temp = locations;

      if (nameFilter) {
        temp = locations.filter(
          (l) =>
            //if location name starts with filter
            l.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
            //if the name of any location creature starts with filter
            l.creatures.some((lc) =>
              creatures
                .find((c) => c._id === lc.creatureId)
                .name.toLowerCase()
                .startsWith(nameFilter.toLowerCase())
            )
        );
      }

      if (selectedSize || selectedType || selectedLevel) {
        if (selectedSize) {
          temp = temp.filter((l) => l.size === selectedSize);
        }

        if (selectedType) {
          temp = temp.filter((l) =>
            selectedSize === lc.LOCATION_SIZES.POINT_OF_INTEREST ? l.interaction.type === selectedType : l.traversal.type === selectedType
          );
        }

        if (selectedLevel) {
          temp = temp.filter((l) => l.exteriorLocationId === selectedLevel);
        } else {
          temp = temp.filter((l) => l._id !== id);
        }

        if (temp.length > 0) {
          utils.SortArrayOfObjByStringProperty(temp, "name");
        }
      } else {
        temp.sort((a, b) => (b.exteriorLocationId === id ? 1 : 0) - (a.exteriorLocationId === id ? 1 : 0));
      }

      return temp;
    }

    return filter();
  }, [locations, nameFilter, selectedSize, selectedType, selectedLevel, creatures, id]);

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
      setSelectedLevel(defaultLevel ? null : id);
    }

    resetFilters();
  }, [defaultLevel, id, location]);

  return (
    <Modal title={location.name} className="ModalLocationDetails-container df" onClickToClose={onClose}>
      <main className="content df df-ai-fs df-jc-sb df-f1">
        {contextData.length > 0 && (
          <aside className="details-wrapper df df-fd-c df-jc-fs">
            <h3>Detalhes</h3>
            <div className="df df-fd-c df-rg-20">
              {contextData.map((data, i) => (
                <div className="df df-fd-c df-rg-5" key={i}>
                  {contextData.length > 1 && (
                    <span className="bold">
                      <i className={data.icon}></i> {data.label}
                    </span>
                  )}
                  <div className="details">
                    <span>{data.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
        <aside className="details-wrapper df df-fd-c df-jc-fs">
          <h3>Localizações interiores</h3>

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
            {filteredLocations.map((loc, i) => (
              <React.Fragment key={loc._id}>
                <div className="list-location df df-jc-sb">
                  <button
                    title="Adicionar Dentro"
                    className={`${loc.size === lc.LOCATION_SIZES.POINT_OF_INTEREST ? "invisible" : ""}`}
                    onClick={() => HandleNewLocation(loc._id)}
                    disabled={locations.length >= lc.LOCATIONS_LIMIT || loc.size === lc.LOCATION_SIZES.POINT_OF_INTEREST}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <span>{loc.name}</span>
                  {loc.size === lc.LOCATION_SIZES.POINT_OF_INTEREST || Object.keys(map[loc._id].interiorLocs).length === 0 ? (
                    <button title="Editar" onClick={() => HandleEditLocation(loc)}>
                      <i className="fas fa-pen"></i>
                    </button>
                  ) : (
                    <button title="Abrir Detalhes" onClick={() => OpenModalLocationDetails(loc, loc._id, false)}>
                      <i className="fas fa-eye"></i>
                    </button>
                  )}
                </div>
                {loc.exteriorLocationId === id && filteredLocations[i + 1] && filteredLocations[i + 1].exteriorLocationId !== id && (
                  <div className="level-divider"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </aside>
      </main>
      <div className="divider"></div>
      <footer>
        <button className="button-simple" onClick={() => onClose()}>
          Cancelar
        </button>
        <Button text="Editar" icon="fas fa-pen" onClick={() => HandleEditLocation(location)} />
      </footer>
    </Modal>
  );
}

export default ModalLocationDetails;
