import React, { useState, useEffect, useMemo } from "react";
import * as utils from "../../../../utils";
import { useAuth } from "../../../../contexts/Auth";
import {
  CREATURE_RARITIES,
  GetRarity,
  creatureRarities,
  CREATURE_MOVEMENTS,
  CREATURE_PRIMARY_ALIGNMENTS,
  CREATURE_SECONDARY_ALIGNMENTS,
  CREATURE_HIT_POINTS,
  CREATURE_ATTACKS,
  CREATURE_ARMOR_CLASSES,
  CREATURE_INITIATIVES,
  DAMAGES_EFFECTIVENESS,
  DAMAGE_TYPES,
  LANGUAGES,
  CREATURE_REACTIONS_PER_ROUND,
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
  setSelectedCreatures,
  isSelecting,
  setIsSelecting,
  isBestiaryOpen,
  setIsBestiaryOpen,
  setCreatureToEdit,
  creatures,
}) {
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
    let maxNumberOfCreatures = 20;

    const basicPackLength = creatures.filter((c) => IsBasicPack(c.owner)).length;
    if (basicPackLength > 0) {
      maxNumberOfCreatures += basicPackLength;
    } else {
      maxNumberOfCreatures = 100;
    }

    return maxNumberOfCreatures;
  }

  function HandleEditNewCreature() {
    const newCreature = {
      name: null,
      description: null,
      image: null,
      rarity: null,
      environment: null,
      size: null,
      type: null,
      race: null,
      class: null,
      subClass: null,
      secondaryClass: null,
      secondarySubClass: null,
      movements: {
        speed: CREATURE_MOVEMENTS.MEDIUM,
        flying: null,
        swimming: null,
        burrowing: null,
      },
      primaryAlignment: CREATURE_PRIMARY_ALIGNMENTS.NEUTRAL,
      secondaryAlignment: CREATURE_SECONDARY_ALIGNMENTS.NEUTRAL,
      attributes: {
        strength: null,
        dexterity: null,
        constitution: null,
        intelligence: null,
        wisdom: null,
        charisma: null,
      },
      hitPoints: CREATURE_HIT_POINTS.MEDIUM,
      attack: CREATURE_ATTACKS.MEDIUM,
      armorClass: CREATURE_ARMOR_CLASSES.MEDIUM,
      initiative: CREATURE_INITIATIVES.MEDIUM,
      weakSpots: [],
      damagesEffectiveness: [
        { type: DAMAGE_TYPES.SLASHING, value: DAMAGES_EFFECTIVENESS.NORMAL },
        { type: DAMAGE_TYPES.PIERCING, value: DAMAGES_EFFECTIVENESS.NORMAL },
        { type: DAMAGE_TYPES.BLUDGEONING, value: DAMAGES_EFFECTIVENESS.NORMAL },
        { type: DAMAGE_TYPES.ACID, value: DAMAGES_EFFECTIVENESS.NORMAL },
        { type: DAMAGE_TYPES.COLD, value: DAMAGES_EFFECTIVENESS.NORMAL },
        { type: DAMAGE_TYPES.FIRE, value: DAMAGES_EFFECTIVENESS.NORMAL },
        { type: DAMAGE_TYPES.FORCE, value: DAMAGES_EFFECTIVENESS.NORMAL },
        { type: DAMAGE_TYPES.LIGHTNING, value: DAMAGES_EFFECTIVENESS.NORMAL },
        { type: DAMAGE_TYPES.NECROTIC, value: DAMAGES_EFFECTIVENESS.NORMAL },
        { type: DAMAGE_TYPES.POISON, value: DAMAGES_EFFECTIVENESS.NORMAL },
        { type: DAMAGE_TYPES.PSYCHIC, value: DAMAGES_EFFECTIVENESS.NORMAL },
        { type: DAMAGE_TYPES.RADIANT, value: DAMAGES_EFFECTIVENESS.NORMAL },
        { type: DAMAGE_TYPES.THUNDER, value: DAMAGES_EFFECTIVENESS.NORMAL },
      ],
      conditionImmunities: [],
      languages: [LANGUAGES.COMMON],
      senses: {
        darkVision: null,
        tremorsense: null,
        blindSight: null,
        trueSight: null,
      },
      legendaryResistences: null,
      regeneration: { amount: null, breakDamage: null },
      customSpecials: [],
      actions: [],
      reactions: [],
      reactionsPerRound: CREATURE_REACTIONS_PER_ROUND.NORMAL,
      aura: null,
      treasures: [],
    };

    setCreatureToEdit(newCreature);
  }

  function HandleEditCreature(creature) {
    setCreatureToEdit(utils.clone(creature));
  }

  function HandleSelectCreature(creature) {
    const isAlreadySelected = tempSelectedCreatures.some((selectedCreature) => selectedCreature._id === creature._id);
    let newSelection = tempSelectedCreatures.filter((selectedCreature) => selectedCreature._id !== creature._id);

    if (!isAlreadySelected && tempSelectedCreatures.length + 1 <= MAX_CREATURES_ALLOWED) {
      newSelection.push(creature);
    }
    setTempSelectedCreatures(newSelection);
  }

  function HandleSelectedFromBestiary() {
    utils.SortArrayOfObjByProperty(tempSelectedCreatures, "name");

    HandleClose();
    tempSelectedCreatures.forEach((c) => {
      c.difficultyRatio = GetCreatureDifficultyRatio(GetCreatureOffensiveRatio(c), GetCreatureDefensiveRatio(c));
      c.level = c.rarity === CREATURE_RARITIES.LEGENDARY ? GetRarity(c.rarity).baseOutputMin : GetAverageLevel(c.rarity);
    });
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
          utils.SortArrayOfObjByProperty(group, "name");
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
                  nothingSelected="Raridade"
                  options={creatureRarities}
                  optionDisplay={(o) => o.display}
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
                  </div>
                </div>
              ))}
            </div>
          </main>
          {isSelecting && (
            <div className={`selecting-footer ${filteredCreatures.length <= 3 ? "filtered" : ""}`}>
              <Button text="Confirmar" onClick={HandleSelectedFromBestiary} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Bestiary;
