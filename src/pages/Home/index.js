import React, { useState, useEffect } from "react";
import * as util from "../../utils";
import * as lc from "../../constants/locationConstants";
import * as cc from "../../constants/creatureConstants";
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

  const [showLoadingText, setShowLoadingText] = useState(false);
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
    const NewCombats = combats.filter((_, index) => openTab !== index + 1);

    setCombats(NewCombats);
    setOpenTab(MAIN_TABS.COMBAT);
  }

  function HandleCancel() {
    localStorage.removeItem("creatureToEdit");
    setCreatureToEdit(null);
  }

  async function HandleSaveLocation(locationToSave) {
    if (locationToSave.exteriorLocationId != null) {
      if (!locationToSave.owner) {
        locationToSave.owner = currentUser.uid;
      }

      await (locationToSave._id ? api.put("UpdateLocation", locationToSave) : api.post("SaveLocation", locationToSave))
        .then((response) => {
          if (response.data) {
            window.location.reload(false);
            // let index = locations.findIndex((l) => l._id === locationToSave._id);
            // if (index >= 0) {
            //   locations.splice(index, 1, locationToSave);
            // } else {
            //   locationToSave._id = response.data._id;
            //   locations.push(locationToSave);
            // }

            // setLocations([...locations]);
          }
        })
        .catch((err) => {
          console.log("error in SaveLocation", err);
        });
    } else {
      combatConfig.world = locationToSave;
      HandleSaveCombatConfig();
    }
  }

  async function HandleUpdateLocations(updateLocsReq) {
    await api
      .put("UpdateLocations", updateLocsReq)
      .then((response) => {
        if (response.data) {
          window.location.reload(false);
          // let tempLocations = util.clone(locations);

          // updateLocsReq.ids.forEach((id, i) => {
          //   let location = tempLocations.find((l) => l._id === id);
          //   updateLocsReq.updates[i].forEach((u) => {
          //     util.setObjPropertyValue(location, u.field, u.value);
          //   });
          // });

          // setLocations([...tempLocations]);
        }
      })
      .catch((err) => {
        console.log("error in UpdateLocations", err);
      });
  }

  async function HandleDeleteLocations(ids) {
    await api
      .delete("DeleteLocations", { params: { ids } })
      .then((response) => {
        if (response.data) {
          window.location.reload(false);
          // let filteredLocs = locations.filter((l) => !ids.includes(l._id));

          // setLocations([...filteredLocs]);
        }
      })
      .catch((err) => {
        console.log("error in DeleteLocations", err);
      });
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
    const combatConfigToSave = { ...combatConfig, level, characterGroups: groups, inactiveGroup };

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
    if (locations) {
      locations.forEach((l) => {
        l.creatures = l.creatures.filter((lc) => creatures.some((c) => c._id === lc.creatureId));
      });
    }
  }, [locations, creatures]);

  useEffect(() => {
    api.get("GetCreaturesByOwner", { params: { owner: currentUser.uid } }).then((response) => {
      if (response.data) {
        setCreatures(response.data);
      }
    });

    api.get("GetLocationsByOwner", { params: { owner: currentUser.uid } }).then((response) => {
      if (response.data) {
        setLocations(response.data);
      }
    });

    api.get("GetCombatConfigByOwner", { params: { owner: currentUser.uid } }).then((response) => {
      if (response.data) {
        setCombatConfig(response.data);
        setLevel(response.data.level);
        setGroups(response.data.characterGroups);
        setInactiveGroup(response.data.inactiveGroup);
      } else {
        setCombatConfig({
          owner: currentUser.uid,
          level: 1,
          characterGroups: [],
          inactiveGroup: [],
          world: {
            name: "Cenário",
            traversal: { type: cc.CREATURE_ENVIRONMENTS.AQUATIC, irregularTerrainFrequency: lc.IRREGULAR_TERRAIN_FREQUENCIES.LOW },
            contexts: [
              {
                isCurrent: true,
                name: "Normal",
                panoramicVision: lc.PANORAMIC_VISIONS.MEDIUM,
                hazardousness: lc.HAZARDOUSNESS.MEDIUM,
                resourceEasiness: lc.RESOURCE_EASINESS.NORMAL,
              },
            ],
            creatures: [],
          },
        });
        setLevel(1);
      }
    });
  }, [currentUser.uid]);

  useEffect(() => {
    setTimeout(() => {
      setShowLoadingText(true);
    }, 3000);
  }, []);

  return !combatConfig || !creatures ? (
    <div className="backend-loading">
      <i class="fas fa-spinner fa-spin"></i>
      <h2 style={{ opacity: showLoadingText ? 1 : 0 }}>Por favor aguarde enquanto tiramos o site de inativade. Isso pode lever até 20 segundos...</h2>
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
        <div className={`section-wrapper ${openTab !== MAIN_TABS.MAP ? "hidden" : ""}`}>
          <Map
            HandleSaveLocation={HandleSaveLocation}
            HandleUpdateLocations={HandleUpdateLocations}
            HandleDeleteLocations={HandleDeleteLocations}
            HandleSelectFromBestiary={HandleSelectFromBestiary}
            setSelectedCreatures={setSelectedCreatures}
            creatures={creatures}
            combatConfig={combatConfig}
            locations={locations}
            userId={currentUser.uid}
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
