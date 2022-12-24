import React, { useState, useEffect } from "react";
//  import api from "../../services/api";
import * as utils from "../../utils";

import NaviBar from "../../components/NaviBar";
import SkillCheck from "./components/SkillCheck";
// import CombatSetup from "./components/CombatSetup";
// import Combat from "./components/Combat";
import Treasure from "./components/Treasure";
import EditCreature from "./components/EditCreature";

import background from "../../assets/background.png";
import "./styles.css";

function Home() {
  const MAIN_TABS = {
    SKILL_CHECK: "Teste",
    GENERAL: "Início",
    // COMBAT: "Combate",
    TREASURE: "Tesouro",
  };

  const [openTab, setOpenTab] = useState(MAIN_TABS.GENERAL);
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  const [isSelectingParty, setIsSelectingParty] = useState(false);
  const [isBestiaryOpen, setIsBestiaryOpen] = useState(false);
  const [isSelectingBestiary, setIsSelectingBestiary] = useState(false);
  const [isEditCreatureOpen, setIsEditCreatureOpen] = useState(false);
  const [creatureToEdit, setCreatureToEdit] = useState(null);
  const [level, setLevel] = useState(null);
  const [groups, setGroups] = useState([]);
  const [creatures, setCreatures] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [selectedCreatures, setSelectedCreatures] = useState([]);
  const [combats, setCombats] = useState([]);

  useEffect(() => {
    // api.get("items").then((response) => {
    //   setItems(response.data);
    // });

    setLevel(3);
    // setGroups([
    //   ["Foux", "Isaac", "Zeth", "Adler", "Motonui", "Elros"],
    //   ["Soiaz", "Yaisyl"],
    // ]);

    let savedCreatures = [];
    let savedCreature = {
      name: "Hidra Alada",
      description: null,
      image: "https://i.pinimg.com/564x/01/d4/17/01d417c02bd190a056c718650fc9db3b.jpg",
      rarity: 10,
      environment: 10,
      size: 10,
      type: 10,
      race: null,
      class: null,
      subClass: null,
      secondaryClass: null,
      secondarySubClass: null,
      movements: {
        speed: 10,
        flying: null,
        swimming: null,
        burrowing: null,
      },
      primaryAlignment: 10,
      secondaryAlignment: 10,
      attributes: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      hitPoints: 10,
      attack: 10,
      armorClass: 10,
      initiative: 10,
      weakSpots: [],
      damagesEffectiveness: [
        { type: 10, value: 20 },
        { type: 20, value: 20 },
        { type: 30, value: 20 },
        { type: 40, value: 20 },
        { type: 50, value: 20 },
        { type: 60, value: 20 },
        { type: 70, value: 20 },
        { type: 80, value: 20 },
        { type: 90, value: 20 },
        { type: 100, value: 20 },
        { type: 110, value: 20 },
        { type: 120, value: 20 },
        { type: 130, value: 20 },
      ],
      conditionImmunities: [],
      languages: [10],
      senses: {
        darkVision: null,
        tremorsense: null,
        blindSight: null,
        trueSight: null,
      },
      legendaryResistences: null,
      regeneration: { amount: null, breakDamage: null },
      customSpecials: [],
      actions: [
        {
          name: "Ataque Comum",
          frequency: 10,
          type: 10,
          reach: 10,
        },
      ],
      reactions: [],
      reactionsPerRound: 10,
      aura: null,
      treasures: [],
    };
    for (let index = 1; index <= 1; index++) {
      let newCreature = utils.clone(savedCreature);
      newCreature.name = [newCreature.name, index].join(" ");
      newCreature.rarity = index * 10;
      savedCreatures.push(newCreature);
    }

    setCreatures(savedCreatures);
  }, [setCreatures]);

  // function HandleSelectFromParty() {
  //   if (groups.length === 1) {
  //     setSelectedCharacters(...groups);
  //   } else {
  //     setIsSelectingParty(true);
  //     setIsPartyOpen(true);
  //   }
  //   setIsBestiaryOpen(false);
  // }

  // function HandleSelectFromBestiary() {
  //   setIsSelectingBestiary(true);
  //   setIsBestiaryOpen(true);
  //   setIsPartyOpen(false);
  // }

  // function HandleGenerateCombat() {
  //   const newCombatTab = combats.length + 1;
  //   setCombats([...combats, { selectedCharacters, selectedCreatures }]);
  //   setOpenTab(newCombatTab);
  //   setSelectedCharacters([]);
  //   setSelectedCreatures([]);
  // }

  function HandleEndCombat() {
    const NewCombats = combats.filter((combat, index) => openTab !== index + 1);

    setCombats(NewCombats);
    setOpenTab(MAIN_TABS.COMBAT);
  }

  function HandleSave(creatureToSave) {
    //call api and proceed on success

    let creatureIndex = creatures.findIndex((c) => c.name === creatureToSave.name);
    if (creatureIndex >= 0) {
      creatures.splice(creatureIndex, 1, creatureToSave);
    } else {
      creatures.push(creatureToSave);
    }

    setIsEditCreatureOpen(false);
  }

  function HandleDelete(creatureToDelete) {
    //call api and proceed on success

    let creatureIndex = creatures.findIndex((c) => c.name === creatureToDelete.name);

    creatures.splice(creatureIndex, 1);

    setCreatures(creatures);
    setIsEditCreatureOpen(false);
  }

  return (
    <div className="Home-container">
      <NaviBar
        combats={combats}
        selectedCharacters={selectedCharacters}
        setSelectedCharacters={setSelectedCharacters}
        selectedCreatures={selectedCreatures}
        setSelectedCreatures={setSelectedCreatures}
        isSelectingParty={isSelectingParty}
        isSelectingBestiary={isSelectingBestiary}
        setIsSelectingParty={setIsSelectingParty}
        setIsSelectingBestiary={setIsSelectingBestiary}
        isPartyOpen={isPartyOpen}
        setIsPartyOpen={setIsPartyOpen}
        isBestiaryOpen={isBestiaryOpen}
        setIsBestiaryOpen={setIsBestiaryOpen}
        level={level}
        setLevel={setLevel}
        groups={groups}
        setGroups={setGroups}
        creatures={creatures}
        setCreatures={setCreatures}
        tabOptions={MAIN_TABS}
        openTab={openTab}
        setOpenTab={setOpenTab}
        isEditCreatureOpen={isEditCreatureOpen}
        setCreatureToEdit={setCreatureToEdit}
        setIsEditCreatureOpen={setIsEditCreatureOpen}
        HandleEndCombat={HandleEndCombat}
      />
      <img src={background} alt="Created by liuzishan - www.freepik.com" />

      <div className={`section-wrapper ${isEditCreatureOpen ? "hidden" : ""}`}>
        <div className={`section-wrapper ${openTab !== MAIN_TABS.SKILL_CHECK ? "hidden" : ""}`}>
          <SkillCheck resultText={openTab} level={level} />
        </div>
        <div className={`section-wrapper ${openTab !== MAIN_TABS.GENERAL ? "hidden" : ""}`}>
          <span></span>
        </div>
        {/* <div className={`section-wrapper ${openTab !== MAIN_TABS.COMBAT ? "hidden" : ""}`}>
          <CombatSetup
            selectedCharacters={selectedCharacters}
            selectedCreatures={selectedCreatures}
            setSelectedCreatures={setSelectedCreatures}
            HandleSelectFromParty={HandleSelectFromParty}
            HandleSelectFromBestiary={HandleSelectFromBestiary}
            HandleGenerateCombat={HandleGenerateCombat}
            resultText={openTab}
            level={level}
          />
        </div>
        {combats.map((combat, index) => (
          <div key={index} className={`section-wrapper ${openTab !== index + 1 ? "hidden" : ""}`}>
            <Combat combat={combat} />
          </div>
        ))} */}

        <div className={`section-wrapper ${openTab !== MAIN_TABS.TREASURE ? "hidden" : ""}`}>
          <Treasure resultText={openTab} level={level} />
        </div>
      </div>

      {isEditCreatureOpen && (
        <div className={"section-wrapper"}>
          <EditCreature
            creatureToEdit={creatureToEdit}
            HandleSave={HandleSave}
            HandleDelete={HandleDelete}
            FinishEditing={() => setIsEditCreatureOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
