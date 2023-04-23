import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/Auth";

import NaviBar from "../../components/NaviBar";
import SkillCheck from "./components/SkillCheck";
// import CombatSetup from "./components/CombatSetup";
import Map from "./components/Map";
import Combat from "./components/Combat";
import Treasure from "./components/Treasure";
import EditCreature from "./components/EditCreature";

import background from "../../assets/background.png";
import "./styles.css";

function Home() {
  const MAIN_TABS = {
    SKILL_CHECK: "Teste de Perícia",
    MAP: "Mapa",
    TREASURE: "Tesouro",
  };

  const [openTab, setOpenTab] = useState(MAIN_TABS.MAP);
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  const [isSelectingParty, setIsSelectingParty] = useState(false);
  const [isBestiaryOpen, setIsBestiaryOpen] = useState(false);
  const [isSelectingBestiary, setIsSelectingBestiary] = useState(false);
  const [HandleSelectedFromBestiary, setHandleSelectedFromBestiary] = useState({ onSelect: () => {} });
  const [creatureToEdit, setCreatureToEdit] = useState(null);
  const [combatConfig, setCombatConfig] = useState(null);
  const [level, setLevel] = useState(null);
  const [groups, setGroups] = useState([]);
  const [inactiveGroup, setInactiveGroup] = useState([]);
  const [creatures, setCreatures] = useState(null);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [selectedCreatures, setSelectedCreatures] = useState([]);
  const [combats, setCombats] = useState([]);
  const [locations, setLocations] = useState(null);

  const { currentUser } = useAuth();

  // function HandleSelectFromParty() {
  //   setIsSelectingParty(true);
  //   setIsPartyOpen(true);
  //   setIsBestiaryOpen(false);
  // }

  function HandleSelectFromBestiary(onSelect = () => {}) {
    setIsSelectingBestiary(true);
    setIsBestiaryOpen(true);
    setIsPartyOpen(false);
    setHandleSelectedFromBestiary({ onSelect });
  }

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

  function HandleCancel() {
    localStorage.removeItem("creatureToEdit");
    setCreatureToEdit(null);
  }

  async function HandleSaveLocation(locationToSave) {
    if (!locationToSave.owner) {
      locationToSave.owner = currentUser.uid;
    }

    // let index = creatures.findIndex((c) => c._id === response.data._id);
    // if (index >= 0) {
    //   creatures.splice(index, 1, creatureToSave);
    // } else {
    //   creatureToSave._id = response.data._id;
    locations.push(locationToSave);
    // }
  }

  function HandleDeleteLocation(locationToDelete) {
    // let index = creatures.findIndex((c) => c._id === response.data._id);
    // creatures.splice(index, 1);

    setLocations(locations);
  }

  async function HandleSaveCreature(creatureToSave) {
    if (!creatureToSave.owner) {
      creatureToSave.owner = currentUser.uid;
    }

    await (creatureToSave._id ? api.put("UpdateCreature", creatureToSave) : api.post("SaveCreature", creatureToSave))
      .then((response) => {
        if (response.data) {
          let index = creatures.findIndex((c) => c._id === response.data._id);
          if (index >= 0) {
            creatures.splice(index, 1, creatureToSave);
          } else {
            creatureToSave._id = response.data._id;
            creatures.push(creatureToSave);
          }

          localStorage.removeItem("creatureToEdit");
          setCreatureToEdit(null);
        }
      })
      .catch((err) => {
        console.log("error in SaveCreature", err);
      });
  }

  function HandleDeleteCreature(creatureToDelete) {
    api
      .delete("DeleteCreature", { params: { id: creatureToDelete._id } })
      .then((response) => {
        if (response.data) {
          let index = creatures.findIndex((c) => c._id === response.data._id);
          creatures.splice(index, 1);

          localStorage.removeItem("creatureToEdit");
          setCreatures(creatures);
          setCreatureToEdit(null);
        }
      })
      .catch((err) => {
        console.log("error in DeleteCreature", err);
      });
  }

  async function HandleSaveCombatConfig() {
    const combatConfigToSave = { _id: combatConfig._id, owner: combatConfig.owner, level, characterGroups: groups, inactiveGroup };

    await (combatConfigToSave._id ? api.put("UpdateCombatConfig", combatConfigToSave) : api.post("SaveCombatConfig", combatConfigToSave))
      .then((response) => {
        if (response.data) {
          setCombatConfig(response.data);
        }
      })
      .catch((err) => {
        console.log("error in SaveCombatConfig", err);
      });
  }

  useEffect(() => {
    const savedCreatureToEdit = localStorage.getItem("creatureToEdit");
    if (savedCreatureToEdit) {
      setCreatureToEdit(JSON.parse(savedCreatureToEdit));
    }
  }, []);

  useEffect(() => {
    const savedCreatureToEdit = localStorage.getItem("creatureToEdit");
    if (savedCreatureToEdit) {
      setCreatureToEdit(JSON.parse(savedCreatureToEdit));
    }
  }, []);

  useEffect(() => {
    api.get("GetCreaturesByOwner", { params: { owner: currentUser.uid } }).then((response) => {
      if (response.data) {
        setCreatures(response.data);
      }
    });

    setLocations([]);

    api.get("GetCombatConfigByOwner", { params: { owner: currentUser.uid } }).then((response) => {
      if (response.data) {
        setCombatConfig(response.data);
        setLevel(response.data.level);
        setGroups(response.data.characterGroups);
        setInactiveGroup(response.data.inactiveGroup);
      } else {
        setCombatConfig({ owner: currentUser.uid, level: 1, characterGroups: [], inactiveGroup: [] });
        setLevel(1);
      }
    });
  }, [setCreatures, currentUser.uid]);

  return !combatConfig || !creatures ? (
    <div className="backend-loading">
      <h2>Por favor aguarde enquanto tiramos o site de inativade. Isso pode lever até 20 segundos...</h2>
    </div>
  ) : (
    <div className="Home-container">
      <NaviBar
        combats={combats}
        selectedCharacters={selectedCharacters}
        setSelectedCharacters={setSelectedCharacters}
        selectedCreatures={selectedCreatures}
        HandleSelectedFromBestiary={HandleSelectedFromBestiary}
        isSelectingParty={isSelectingParty}
        isSelectingBestiary={isSelectingBestiary}
        setIsSelectingParty={setIsSelectingParty}
        setIsSelectingBestiary={setIsSelectingBestiary}
        isPartyOpen={isPartyOpen}
        setIsPartyOpen={setIsPartyOpen}
        isBestiaryOpen={isBestiaryOpen}
        setIsBestiaryOpen={setIsBestiaryOpen}
        HandleSaveCombatConfig={HandleSaveCombatConfig}
        level={level}
        setLevel={setLevel}
        groups={groups}
        setGroups={setGroups}
        inactiveGroup={inactiveGroup}
        setInactiveGroup={setInactiveGroup}
        creatures={creatures}
        setCreatures={setCreatures}
        tabOptions={MAIN_TABS}
        openTab={openTab}
        setOpenTab={setOpenTab}
        creatureToEdit={creatureToEdit}
        setCreatureToEdit={setCreatureToEdit}
        HandleEndCombat={HandleEndCombat}
      />
      <img src={background} alt="Created by liuzishan - www.freepik.com" />

      <div className={`section-container ${creatureToEdit ? "hidden" : ""}`}>
        <div className={`section-wrapper ${openTab !== MAIN_TABS.SKILL_CHECK ? "hidden" : ""}`}>
          <SkillCheck resultText={openTab} level={level} />
        </div>
        <div className={`section-wrapper map ${openTab !== MAIN_TABS.MAP ? "hidden" : ""}`}>
          <Map
            HandleSaveLocation={HandleSaveLocation}
            HandleDeleteLocation={HandleDeleteLocation}
            HandleSelectFromBestiary={HandleSelectFromBestiary}
            setSelectedCreatures={setSelectedCreatures}
            creatures={creatures}
          />
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
        </div> */}
        {combats.map((combat, index) => (
          <div key={index} className={`section-wrapper ${openTab !== index + 1 ? "hidden" : ""}`}>
            <Combat combat={combat} />
          </div>
        ))}

        <div className={`section-wrapper ${openTab !== MAIN_TABS.TREASURE ? "hidden" : ""}`}>
          <Treasure resultText={openTab} level={level} />
        </div>
      </div>

      {creatureToEdit && (
        <div className={"section-wrapper"}>
          <EditCreature
            creatureToEdit={creatureToEdit}
            HandleSave={HandleSaveCreature}
            HandleDelete={HandleDeleteCreature}
            FinishEditing={HandleCancel}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
