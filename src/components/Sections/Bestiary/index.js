import React, { useState, useEffect, useMemo } from "react";
//  import api from "../../services/api";
import { SortArrayOfObjByProperty } from "../../../utils";
import { CREATURE_LEVELS, CREATURE_ENVIROMENTS, CREATURE_TYPES, CREATURE_SIZE } from "../../../helpers/bestiaryHelper";

import Button from "../../Button";
import CheckInput from "../../CheckInput";
import Select from "../../Select";

import "./styles.css";

function Bestiary({
  selectedCreatures,
  setSelectedCreatures,
  isSelecting,
  setIsSelecting,
  isBestiaryOpen,
  setIsBestiaryOpen,
  setIsEditCreatureOpen,
  creatures,
  setCreatures,
}) {
  const [nameFilter, setNameFilter] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [tempSelectedCreatures, setTempSelectedCreatures] = useState([]);

  let filteredCreatures = [];
  const MAX_SELECTED = 7;

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  function HandleSelectCreature(creature) {
    const isAlreadySelected = tempSelectedCreatures.some((selectedCreature) => selectedCreature.name === creature.name);
    let newSelection = tempSelectedCreatures.filter((selectedCreature) => selectedCreature.name !== creature.name);

    if (!isAlreadySelected && tempSelectedCreatures.length + 1 <= MAX_SELECTED) {
      newSelection.push(creature);
    }
    setTempSelectedCreatures(newSelection);
  }

  function HandleSelectedFromBestiary() {
    SortArrayOfObjByProperty(tempSelectedCreatures, "name");

    HandleClose();
    setSelectedCreatures(tempSelectedCreatures);
  }

  function HandleClose() {
    // setSelectedCreatures([]);
    setTempSelectedCreatures([]);
    setIsSelecting(false);
    setIsBestiaryOpen(false);
  }

  function handleFilter(setValue, value) {
    setValue(value);
  }

  filteredCreatures = useMemo(() => {
    function filterCreatures() {
      let temp = creatures;

      if (nameFilter) {
        temp = creatures.filter((creature) => creature.name.toLowerCase().includes(nameFilter.toLowerCase()));
      }
      if (selectedLevel) {
        temp = temp.filter((creature) => creature.levelRange === selectedLevel);
      }
      if (selectedEnv) {
        temp = temp.filter((creature) => creature.environment === selectedEnv);
      }
      if (selectedType) {
        temp = temp.filter((creature) => creature.type === selectedType);
      }
      if (selectedSize) {
        temp = temp.filter((creature) => creature.size === selectedSize);
      }

      return temp;
    }

    return filterCreatures();
  }, [creatures, nameFilter, selectedLevel, selectedEnv, selectedType, selectedSize]);

  useEffect(() => {
    setTempSelectedCreatures(selectedCreatures);
  }, [selectedCreatures]);

  return (
    <div className="Bestiary-container">
      {isSelecting && <div className="screen-block" onClick={HandleClose}></div>}
      <div
        className="sharp-button"
        onClick={() => {
          setIsBestiaryOpen(true);
        }}
      >
        {/* border 2 */}
        <div>
          <aside />
          <main />
        </div>
        {/* border 1 */}
        <div>
          <aside />
          <main />
        </div>
        {/* button body */}
        <div>
          <aside />
          <main>
            <h5>BESTIÁRIO</h5>
            <h6>{creatures.length} Criaturas</h6>
          </main>
        </div>
      </div>
      {isBestiaryOpen && (
        <div className="bestiary-tab">
          <header className={isSelecting ? "selecting-header" : ""}>
            <div>
              <div className="sharp-button" onClick={HandleClose}>
                {/* border 2 */}
                <div>
                  <main />
                  <aside />
                </div>
                {/* border 1 */}
                <div>
                  <main />
                  <aside />
                </div>
                {/* button body */}
                <div>
                  <main />
                  <aside />
                </div>
              </div>
              {!isSelecting ? <h5>{creatures.length} Criaturas</h5> : <h5>Selecione até {MAX_SELECTED} criaturas para esse combate</h5>}
            </div>
            <h5>BESTIÁRIO</h5>
          </header>
          <main>
            {!isSelecting && (
              <aside>
                <Button text="Adicionar Criatura" onClick={() => setIsEditCreatureOpen(true)} />
              </aside>
            )}{" "}
            <div className="bestiary-filters">
              <h5>Filtrar Por</h5>
              <div className="filter-text">
                <input onChange={(e) => handleFilter(setNameFilter, e.target.value)} placeholder="Nome" value={nameFilter}></input>
                <button onClick={() => setNameFilter("")}>LIMPAR</button>
              </div>
              <main>
                <Select
                  extraWidth={20}
                  value={selectedLevel}
                  onSelect={(value) => handleFilter(setSelectedLevel, value)}
                  defaultValue="Nível"
                  options={CREATURE_LEVELS}
                />
                <Select
                  extraWidth={60}
                  value={selectedEnv}
                  onSelect={(value) => handleFilter(setSelectedEnv, value)}
                  defaultValue="Ambiente"
                  options={CREATURE_ENVIROMENTS}
                />
                <Select
                  extraWidth={60}
                  value={selectedType}
                  onSelect={(value) => handleFilter(setSelectedType, value)}
                  defaultValue="Tipo"
                  options={CREATURE_TYPES}
                />
                <Select
                  extraWidth={20}
                  value={selectedSize}
                  onSelect={(value) => handleFilter(setSelectedSize, value)}
                  defaultValue="Tamanho"
                  options={CREATURE_SIZE}
                />
              </main>
            </div>
            <div className="bestiary-list">
              {filteredCreatures.map((creature) => (
                <div
                  className={`list-creature ${
                    isSelecting && tempSelectedCreatures.some((selectedCreature) => selectedCreature.name === creature.name)
                      ? "selected-creature"
                      : ""
                  }`}
                  key={creature.name}
                  onClick={
                    () => (isSelecting ? HandleSelectCreature(creature) : {})
                    // setIsEditCreatureOpen(true)
                  }
                >
                  {!isSelecting ? (
                    <div className="edit-creature">
                      <i class="fas fa-pencil-alt fa-xs"></i>
                    </div>
                  ) : (
                    <div className="select-creature">
                      <CheckInput isSelected={tempSelectedCreatures.some((selectedCreature) => selectedCreature.name === creature.name)} />
                    </div>
                  )}
                  <h6>{creature.name}</h6>
                  <img src={creature.image} alt="creature-avatar" />
                  <div className="creature-details">
                    <h6>{creature.levelRange}, &nbsp;</h6>
                    <h6>{creature.environment}, &nbsp;</h6>
                    <h6>{creature.type}, &nbsp;</h6>
                    <h6>{creature.size}</h6>
                  </div>
                </div>
              ))}
            </div>
          </main>
          {isSelecting && (
            <div className={`selecting-footer ${filteredCreatures.length <= 3 ? "filtered" : ""}`}>
              <h5>
                {tempSelectedCreatures.length > 0 ? `${tempSelectedCreatures.length} criatura(s) selecionada(s)` : "Nenhuma criatura selecionada"}
              </h5>
              <Button text="Confirmar" onClick={HandleSelectedFromBestiary} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Bestiary;
