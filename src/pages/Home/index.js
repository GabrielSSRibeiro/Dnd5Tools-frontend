import React, { useState } from "react";
//  import api from "../../services/api";

import NaviBar from "../../components/NaviBar";
import SkillCheck from "../../components/Sections/SkillCheck";
import Combat from "../../components/Sections/Combat";
import Treasure from "../../components/Sections/Treasure";
import EditCreature from "../../components/Sections/EditCreature";

import background from "../../assets/background.png";
import "./styles.css";

function Home() {
  const MAIN_TABS = { SKILL_CHECK: "Teste", COMBAT: "Combate", TREASURE: "Tesouro" };

  const [openTab, setOpenTab] = useState(MAIN_TABS.COMBAT);
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  const [isSelectingParty, setIsSelectingParty] = useState(false);
  const [isBestiaryOpen, setIsBestiaryOpen] = useState(false);
  const [isSelectingBestiary, setIsSelectingBestiary] = useState(false);
  const [isEditCreatureOpen, setIsEditCreatureOpen] = useState(false);
  const [level, setLevel] = useState(3);
  const [groups, setGroups] = useState([
    ["Soiaz", "Foux", "Isaac"],
    ["a", "b"],
  ]);
  const [creatures, setCreatures] = useState(
    new Array(20).fill({
      name: "Argon, o Temível",
      image: "https://i.pinimg.com/564x/35/66/9f/35669f32657cd4e0c5420e1e16fe301d.jpg",
      levelRange: "5 - 8",
      environment: "Floresta",
      type: "Elemental",
      size: "Médio",
    })
  );
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [selectedCreatures, setSelectedCreatures] = useState([]);
  const [combats, setCombats] = useState([]);

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  function HandleSelectFromParty() {
    if (groups.length === 1) {
      setSelectedCharacters(...groups);
    } else {
      setIsSelectingParty(true);
      setIsPartyOpen(true);
    }
  }

  function HandleSelectFromBestiary() {
    setIsSelectingBestiary(true);
    setIsBestiaryOpen(true);
  }

  function HandleGenerateCombat(creatures) {
    setCombats([...combats, { group: selectedCharacters, creatures: creatures }]);
  }

  return (
    <div className="Home-container">
      <NaviBar
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
        setIsEditCreatureOpen={setIsEditCreatureOpen}
      />
      <img src={background} alt={<a href="https://www.freepik.com/photos/people">People photo created by liuzishan - www.freepik.com</a>} />
      {!isEditCreatureOpen ? (
        <>
          {openTab === MAIN_TABS.SKILL_CHECK && <SkillCheck resultText={openTab} level={level} />}
          {openTab === MAIN_TABS.COMBAT && (
            <Combat
              selectedCharacters={selectedCharacters}
              selectedCreatures={selectedCreatures}
              HandleSelectFromParty={HandleSelectFromParty}
              HandleSelectFromBestiary={HandleSelectFromBestiary}
              HandleGenerateCombat={HandleGenerateCombat}
              resultText={openTab}
              level={level}
            />
          )}
          {openTab === MAIN_TABS.TREASURE && <Treasure resultText={openTab} level={level} />}
        </>
      ) : (
        <EditCreature setIsEditCreatureOpen={setIsEditCreatureOpen} />
      )}
    </div>
  );
}

export default Home;
