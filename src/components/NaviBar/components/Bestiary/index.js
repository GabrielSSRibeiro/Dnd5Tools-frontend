import React, { useState, useEffect, useMemo } from "react";
import * as utils from "../../../../utils";
import { CREATURE_RARITIES, creatureRarities, creatureEnvironments, creatureSizes, creatureTypes } from "../../../../constants/creatureConstants";
import { MAX_CREATURES_ALLOWED } from "../../../../constants/combatConstants";

import Button from "../../../Button";
import CheckInput from "../../../CheckInput";
import Select from "../../../Select";

import commonGem from "../../../../assets/Common-gem.png";
import uncommonGem from "../../../../assets/Uncommon-gem.png";
import rareGem from "../../../../assets/Rare-gem.png";
import veryRareGem from "../../../../assets/Very Rare-gem.png";
import LegendaryGem from "../../../../assets/Legendary-gem.png";
import "./styles.css";

function Bestiary({
  selectedCreatures,
  selectedCharacters,
  level,
  setSelectedCreatures,
  isSelecting,
  setIsSelecting,
  isBestiaryOpen,
  setIsBestiaryOpen,
  setIsEditCreatureOpen,
  setCreatureToEdit,
  creatures,
}) {
  const [nameFilter, setNameFilter] = useState(null);
  const [selectedRarity, setSelectedRarity] = useState(null);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [tempSelectedCreatures, setTempSelectedCreatures] = useState(selectedCreatures);

  const maxNumberOfCreatures = 20;
  const rarityGems = [
    { rarity: CREATURE_RARITIES.COMMON, gem: commonGem },
    { rarity: CREATURE_RARITIES.UNCOMMON, gem: uncommonGem },
    { rarity: CREATURE_RARITIES.RARE, gem: rareGem },
    { rarity: CREATURE_RARITIES.VERY_RARE, gem: veryRareGem },
    { rarity: CREATURE_RARITIES.LEGENDARY, gem: LegendaryGem },
  ];
  let filteredCreatures = [];

  function HandleEditNewCreature() {
    setCreatureToEdit(null);
    setIsEditCreatureOpen(true);
  }

  function HandleEditCreature(creature) {
    setCreatureToEdit(creature);
    setIsEditCreatureOpen(true);
  }

  function HandleSelectCreature(creature) {
    const isAlreadySelected = tempSelectedCreatures.some((selectedCreature) => selectedCreature.name.includes(creature.name));
    let newSelection = tempSelectedCreatures.filter((selectedCreature) => !selectedCreature.name.includes(creature.name));

    if (!isAlreadySelected && tempSelectedCreatures.length + 1 <= MAX_CREATURES_ALLOWED) {
      newSelection.push(creature);
    }
    setTempSelectedCreatures(newSelection);
  }

  function HandleSelectedFromBestiary() {
    utils.SortArrayOfObjByProperty(tempSelectedCreatures, "name");

    HandleClose();
    setSelectedCreatures(tempSelectedCreatures);
  }

  function HandleClose() {
    setTempSelectedCreatures(selectedCreatures);
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

      if (selectedRarity) {
        temp = temp.filter((creature) => creature.rarity === selectedRarity);
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

      if (temp.length > 0) {
        utils.SortArrayOfObjByProperty(temp, "name");
      }

      return temp;
    }

    return filterCreatures();
  }, [creatures, nameFilter, selectedRarity, selectedEnv, selectedType, selectedSize]);

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
              {!isSelecting ? (
                <h5>{creatures.length} Criaturas</h5>
              ) : (
                <h5>
                  {tempSelectedCreatures.length} de até {MAX_CREATURES_ALLOWED} criaturas selecionadas
                </h5>
              )}
            </div>
            {!isSelecting && <h5>BESTIÁRIO</h5>}
          </header>
          <main>
            {!isSelecting && (
              <aside>
                <Button text="Adicionar Criatura" onClick={HandleEditNewCreature} isDisabled={creatures.length >= maxNumberOfCreatures} />
              </aside>
            )}{" "}
            <div className="bestiary-filters">
              <h5>Filtrar Por</h5>
              <div className="filter-text">
                <input onChange={(e) => handleFilter(setNameFilter, e.target.value)} placeholder="Nome" value={nameFilter ?? ""}></input>
                <button onClick={() => setNameFilter("")}>LIMPAR</button>
              </div>
              <main>
                <Select
                  extraWidth={40}
                  value={selectedRarity}
                  onSelect={(value) => handleFilter(setSelectedRarity, value)}
                  nothingSelected="Nível"
                  options={creatureRarities}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                />
                <Select
                  extraWidth={80}
                  value={selectedEnv}
                  onSelect={(value) => handleFilter(setSelectedEnv, value)}
                  nothingSelected="Ambiente"
                  options={creatureEnvironments}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                />
                <Select
                  extraWidth={60}
                  value={selectedType}
                  onSelect={(value) => handleFilter(setSelectedType, value)}
                  nothingSelected="Tipo"
                  options={creatureTypes}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                />
                <Select
                  extraWidth={20}
                  value={selectedSize}
                  onSelect={(value) => handleFilter(setSelectedSize, value)}
                  nothingSelected="Tamanho"
                  options={creatureSizes}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                />
              </main>
            </div>
            <div className="bestiary-list">
              {filteredCreatures.map((creature, index) => (
                <div
                  className={`list-creature ${
                    isSelecting && tempSelectedCreatures.some((selectedCreature) => selectedCreature.name === creature.name)
                      ? "selected-creature"
                      : ""
                  }`}
                  key={index}
                  onClick={() => (isSelecting ? HandleSelectCreature(creature) : HandleEditCreature(creature))}
                >
                  {isSelecting && (
                    <div className="select-creature">
                      <CheckInput isSelected={tempSelectedCreatures.some((selectedCreature) => selectedCreature.name === creature.name)} />
                    </div>
                  )}
                  <h6>{creature.name}</h6>
                  <div className="creature-portrait">
                    <div className="creature-gem">
                      <div className="gem-border">
                        <div className="placement">
                          <div className="shape"></div>
                        </div>
                      </div>
                      <img src={rarityGems.find((rg) => rg.rarity === creature.rarity).gem} alt="creature-gem" />
                    </div>
                    <img className="creature-avatar" src={creature.image} alt="creature-avatar" />
                  </div>
                  <div className="power-scale">
                    <div className="wrapper-with-icon">
                      <i className="fas fa-khanda power-scale-icon"></i>
                      <aside className="power-scale-bar">
                        <div className="power-scale-fill offensive"></div>
                      </aside>
                    </div>
                    <div className="wrapper-with-icon">
                      <i className="fas fa-shield-alt power-scale-icon"></i>
                      <aside className="power-scale-bar">
                        <div className="power-scale-fill defensive"></div>
                      </aside>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
          {isSelecting && (
            <div className={`selecting-footer ${filteredCreatures.length <= 3 ? "filtered" : ""}`}>
              <h5>
                Dificuldade <strong>X</strong> para {selectedCharacters.length} personagens de nível {level}
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
