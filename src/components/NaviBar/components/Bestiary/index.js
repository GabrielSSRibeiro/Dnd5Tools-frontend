import React, { useState, useEffect, useRef, useMemo } from "react";
import * as utils from "../../../../utils";
import { useAuth } from "../../../../contexts/Auth";
import {
  GetNewCreature,
  DEFAULT_AVATAR,
  DEFAULT_AVATAR_POSITION,
  DEFAULT_AVATAR_SCALE,
  CREATURE_RARITIES,
  GetRarity,
  creatureRarities,
  CREATURE_ENVIRONMENTS,
  creatureEnvironments,
  creatureSizes,
  creatureTypes,
} from "../../../../constants/creatureConstants";
import { MAX_CREATURES_ALLOWED } from "../../../../constants/combatConstants";
import { IsBasicPack, GetAverageLevel } from "../../../../helpers/creatureHelper";
import {
  GetCreatureOffensiveRatio,
  GetCreatureDefensiveRatio,
  GetCreatureDifficultyRatio,
  GetCreaturePowerScale,
} from "../../../../helpers/combatHelper";

import Button from "../../../Button";
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
  HandleSelectedFromBestiary,
  isSelecting,
  setIsSelecting,
  isBestiaryOpen,
  setIsBestiaryOpen,
  setCreatureToEdit,
  creatures,
}) {
  const avatarProportion = useRef(180);
  const [nameFilter, setNameFilter] = useState(null);
  const [selectedRarity, setSelectedRarity] = useState(null);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [tempSelectedCreatures, setTempSelectedCreatures] = useState(selectedCreatures);

  const { currentUser } = useAuth();
  const maxNumberOfCreatures = GetMaxNumberOfCreatures();
  const rarityGems = [
    { rarity: CREATURE_RARITIES.COMMON, gem: commonGem },
    { rarity: CREATURE_RARITIES.UNCOMMON, gem: uncommonGem },
    { rarity: CREATURE_RARITIES.RARE, gem: rareGem },
    { rarity: CREATURE_RARITIES.VERY_RARE, gem: veryRareGem },
    { rarity: CREATURE_RARITIES.LEGENDARY, gem: LegendaryGem },
  ];
  const creatureSources = [
    { display: "Pacote Básico", value: "basicPack" },
    { display: "Minhas", value: currentUser.uid },
  ];
  let filteredCreatures = [];

  function GetMaxNumberOfCreatures() {
    let maxNumberOfCreatures = 200;

    const basicPackLength = creatures.filter((c) => IsBasicPack(c.owner)).length;
    if (basicPackLength > 0) {
      maxNumberOfCreatures += basicPackLength;
    }

    return maxNumberOfCreatures;
  }

  function HandleEditNewCreature() {
    const newCreature = GetNewCreature();

    setCreatureToEdit(newCreature);
  }

  function HandleEditCreature(creature) {
    setCreatureToEdit(utils.clone(creature));
  }

  function ClearSelection() {
    setTempSelectedCreatures([]);
  }

  function HandleSelectCreature(creature) {
    const isAlreadySelected = tempSelectedCreatures.some((selectedCreature) => selectedCreature._id === creature._id);
    let newSelection = tempSelectedCreatures.filter((selectedCreature) => selectedCreature._id !== creature._id);

    if (!isAlreadySelected && tempSelectedCreatures.length + 1 <= MAX_CREATURES_ALLOWED) {
      newSelection.push(creature);
    }
    setTempSelectedCreatures(newSelection);
  }

  function HandleSelected() {
    utils.SortArrayOfObjByStringProperty(tempSelectedCreatures, "name");

    HandleClose();
    tempSelectedCreatures.forEach((c) => {
      c.difficultyRatio = GetCreatureDifficultyRatio(GetCreatureOffensiveRatio(c), GetCreatureDefensiveRatio(c));
      c.level = c.rarity === CREATURE_RARITIES.LEGENDARY ? GetRarity(c.rarity).baseOutputMin : GetAverageLevel(c.rarity);
    });
    HandleSelectedFromBestiary.onSelect(tempSelectedCreatures);
  }

  function HandleClose() {
    setTempSelectedCreatures(selectedCreatures);
    setIsSelecting(false);
    setIsBestiaryOpen(false);
  }

  function handleFilter(setValue, value) {
    setValue(value);
  }

  function HandleImgOnError(creature) {
    creature.image = DEFAULT_AVATAR;
    creature.imageX = null;
    creature.imageY = null;
    creature.imageScale = null;
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
        temp = temp.filter((creature) => creature.environment === CREATURE_ENVIRONMENTS.ALL || creature.environment === selectedEnv);
      }

      if (selectedType) {
        temp = temp.filter((creature) => creature.type === selectedType);
      }

      if (selectedSize) {
        temp = temp.filter((creature) => creature.size === selectedSize);
      }

      if (selectedSource) {
        temp = temp.filter((creature) => creature.owner === selectedSource);
      }

      //sort by rarity and name
      if (temp.length > 0) {
        let rarityGroups = Object.values(utils.GroupArrayBy(temp, "rarity"));

        temp = [];
        rarityGroups.forEach((group) => {
          utils.SortArrayOfObjByStringProperty(group, "name");
          temp.push(...group);
        });
      }

      return temp;
    }

    return filterCreatures();
  }, [creatures, nameFilter, selectedRarity, selectedEnv, selectedType, selectedSize, selectedSource]);

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
            <div className={isSelecting ? "full-width" : ""}>
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
                <div className="df df-jc-sb full-width">
                  <h5>
                    {tempSelectedCreatures.length} de até {MAX_CREATURES_ALLOWED} criaturas selecionadas
                  </h5>
                  <button className="button-simple clear-selection" onClick={ClearSelection}>
                    Limpar
                  </button>
                </div>
              )}
            </div>
            {!isSelecting && <h5>BESTIÁRIO</h5>}
          </header>
          <main>
            {/* {!isSelecting && ( */}
            <aside>
              <Button text="Adicionar Criatura" onClick={HandleEditNewCreature} isDisabled={creatures.length >= maxNumberOfCreatures} />
            </aside>
            {/* )} */}
            <div className="bestiary-filters">
              <h5>Filtrar Por</h5>
              <div className="filter-text">
                <input onChange={(e) => handleFilter(setNameFilter, e.target.value)} placeholder="Nome" value={nameFilter ?? ""}></input>
                <button onClick={() => setNameFilter("")}>LIMPAR</button>
              </div>
              <main>
                <Select
                  extraWidth={35}
                  value={selectedRarity}
                  onSelect={(value) => handleFilter(setSelectedRarity, value)}
                  nothingSelected="Raridade"
                  options={creatureRarities}
                  optionDisplay={(o) => o.treasureDisplay}
                  optionValue={(o) => o.value}
                  optionsAtATime={8}
                />
                <Select
                  extraWidth={35}
                  value={selectedEnv}
                  onSelect={(value) => handleFilter(setSelectedEnv, value)}
                  nothingSelected="Ambiente"
                  options={creatureEnvironments}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  optionsAtATime={8}
                />
                <Select
                  extraWidth={60}
                  value={selectedType}
                  onSelect={(value) => handleFilter(setSelectedType, value)}
                  nothingSelected="Tipo"
                  options={creatureTypes}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  optionsAtATime={8}
                />
                <Select
                  extraWidth={15}
                  value={selectedSize}
                  onSelect={(value) => handleFilter(setSelectedSize, value)}
                  nothingSelected="Tamanho"
                  options={creatureSizes}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  optionsAtATime={8}
                />
                <Select
                  extraWidth={-5}
                  value={selectedSource}
                  onSelect={(value) => handleFilter(setSelectedSource, value)}
                  nothingSelected="Fonte"
                  options={creatureSources}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  optionsAtATime={8}
                />
              </main>
            </div>
            <div className="bestiary-list">
              {filteredCreatures.map((creature, index) => (
                <div
                  className={`list-creature ${
                    isSelecting && tempSelectedCreatures.some((selectedCreature) => selectedCreature._id === creature._id) ? "selected-creature" : ""
                  }`}
                  key={index}
                  onClick={() => (isSelecting ? HandleSelectCreature(creature) : HandleEditCreature(creature))}
                >
                  {isSelecting && tempSelectedCreatures.some((selectedCreature) => selectedCreature._id === creature._id) && (
                    <div className="select-creature">
                      <i className="fas fa-check "></i>
                    </div>
                  )}
                  <h6>{creature.name}</h6>
                  <div
                    className="creature-portrait"
                    style={{
                      width: avatarProportion.current,
                      height: avatarProportion.current,
                    }}
                  >
                    <img
                      className={`creature-avatar${IsBasicPack(creature.owner) ? " basic-pack" : ""}`}
                      src={creature.image}
                      alt="creature-avatar"
                      onError={() => HandleImgOnError(creature)}
                      style={{
                        width: avatarProportion.current,
                        height: avatarProportion.current,
                        left: creature.imageX != null ? creature.imageX * avatarProportion.current : DEFAULT_AVATAR_POSITION,
                        top: creature.imageY != null ? creature.imageY * avatarProportion.current : DEFAULT_AVATAR_POSITION,
                        transform: `scale(${creature.imageScale != null ? creature.imageScale : DEFAULT_AVATAR_SCALE})`,
                        transformOrigin: "top left",
                      }}
                    />
                    <div className="creature-gem">
                      <div className="gem-border">
                        <div className="placement">
                          <div className="shape"></div>
                        </div>
                      </div>
                      <img src={rarityGems.find((rg) => rg.rarity === creature.rarity).gem} alt="creature-gem" />
                    </div>
                  </div>

                  <div className="power-scale">
                    {creature.isDraft ? (
                      <div className="df df-cg-5 draft">
                        <i className="fas fa-pencil-ruler"></i>
                        <span>Rascunho</span>
                      </div>
                    ) : (
                      <>
                        <div className="wrapper-with-icon">
                          <i className="fas fa-khanda power-scale-icon"></i>
                          <aside className="power-scale-bar">
                            <div
                              className="power-scale-fill offensive"
                              style={{ width: GetCreaturePowerScale(GetCreatureOffensiveRatio(creature), creature.rarity) }}
                            ></div>
                          </aside>
                        </div>
                        <div className="wrapper-with-icon">
                          <i className="fas fa-shield-alt power-scale-icon"></i>
                          <aside className="power-scale-bar">
                            <div
                              className="power-scale-fill defensive"
                              style={{ width: GetCreaturePowerScale(GetCreatureDefensiveRatio(creature), creature.rarity) }}
                            ></div>
                          </aside>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </main>
          {isSelecting && (
            <div className={`selecting-footer ${filteredCreatures.length <= 3 ? "filtered" : ""}`}>
              <Button text="Confirmar" onClick={HandleSelected} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Bestiary;
