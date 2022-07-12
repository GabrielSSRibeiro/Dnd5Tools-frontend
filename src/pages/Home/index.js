import React, { useState } from "react";
//  import api from "../../services/api";

import NaviBar from "../../components/NaviBar";
import MenuModal from "../../components/MenuModal";
import SkillCheck from "../../components/Sections/SkillCheck";
import CombatSetup from "../../components/Sections/CombatSetup";
import Combat from "../../components/Sections/Combat";
import Treasure from "../../components/Sections/Treasure";
import EditCreature from "../../components/Sections/EditCreature";

import background from "../../assets/background.png";
import "./styles.css";

function Home() {
  const MAIN_TABS = { SKILL_CHECK: "Teste", COMBAT: "Combate", TREASURE: "Tesouro" };

  const [openTab, setOpenTab] = useState(MAIN_TABS.COMBAT);
  const [IsMenuOpen, setIsMenuOpen] = useState(false);
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  const [isSelectingParty, setIsSelectingParty] = useState(false);
  const [isBestiaryOpen, setIsBestiaryOpen] = useState(false);
  const [isSelectingBestiary, setIsSelectingBestiary] = useState(false);
  const [isEditCreatureOpen, setIsEditCreatureOpen] = useState(false);
  const [level, setLevel] = useState(3);
  const [groups, setGroups] = useState([
    ["Foux", "Isaac", "Zeth", "Adler", "Motonui", "Elros"],
    ["Soiaz", "Yaisyl"],
  ]);
  const [creatures, setCreatures] = useState([
    {
      name: "Argon, o Temível A",
      image: "https://i.pinimg.com/564x/35/66/9f/35669f32657cd4e0c5420e1e16fe301d.jpg",
      rarity: "Comum (Nível 1 - 5)",
      environment: "Floresta",
      type: "Elemental",
      size: "Médio",
    },
    {
      name: "Argon, o Temível B",
      image: "https://i.pinimg.com/564x/35/66/9f/35669f32657cd4e0c5420e1e16fe301d.jpg",
      rarity: "Comum (Nível 1 - 5)",
      environment: "Floresta",
      type: "Elemental",
      size: "Médio",
    },
    {
      name: "Argon, o Temível C",
      image: "https://i.pinimg.com/564x/35/66/9f/35669f32657cd4e0c5420e1e16fe301d.jpg",
      rarity: "Comum (Nível 1 - 5)",
      environment: "Floresta",
      type: "Elemental",
      size: "Médio",
    },
    {
      name: "Argon, o Temível D",
      image: "https://i.pinimg.com/564x/35/66/9f/35669f32657cd4e0c5420e1e16fe301d.jpg",
      rarity: "Comum (Nível 1 - 5)",
      environment: "Floresta",
      type: "Elemental",
      size: "Médio",
    },
    {
      name: "Argon, o Temível E",
      image: "https://i.pinimg.com/564x/35/66/9f/35669f32657cd4e0c5420e1e16fe301d.jpg",
      rarity: "Comum (Nível 1 - 5)",
      environment: "Floresta",
      type: "Elemental",
      size: "Médio",
    },
    {
      name: "Argon, o Temível F",
      image: "https://i.pinimg.com/564x/35/66/9f/35669f32657cd4e0c5420e1e16fe301d.jpg",
      rarity: "Comum (Nível 1 - 5)",
      environment: "Floresta",
      type: "Elemental",
      size: "Médio",
    },
    {
      name: "Argon, o Temível G",
      image: "https://i.pinimg.com/564x/35/66/9f/35669f32657cd4e0c5420e1e16fe301d.jpg",
      rarity: "Comum (Nível 1 - 5)",
      environment: "Floresta",
      type: "Elemental",
      size: "Médio",
    },
    {
      name: "Argon, o Temível H",
      image: "https://i.pinimg.com/564x/35/66/9f/35669f32657cd4e0c5420e1e16fe301d.jpg",
      rarity: "Comum (Nível 1 - 5)",
      environment: "Floresta",
      type: "Elemental",
      size: "Médio",
    },
  ]);
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
    setIsBestiaryOpen(false);
  }

  function HandleSelectFromBestiary() {
    setIsSelectingBestiary(true);
    setIsBestiaryOpen(true);
    setIsPartyOpen(false);
  }

  function HandleGenerateCombat() {
    const newCombatTab = combats.length + 1;
    setCombats([...combats, { selectedCharacters, selectedCreatures }]);
    setOpenTab(newCombatTab);
    setSelectedCharacters([]);
    setSelectedCreatures([]);
  }

  function HandleEndCombat() {
    const NewCombats = combats.filter((combat, index) => openTab !== index + 1);

    setCombats(NewCombats);
    setOpenTab(MAIN_TABS.COMBAT);
  }

  return (
    <div className="Home-container">
      {IsMenuOpen && <MenuModal setIsMenuOpen={setIsMenuOpen} />}
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
        setIsMenuOpen={setIsMenuOpen}
        openTab={openTab}
        setOpenTab={setOpenTab}
        isEditCreatureOpen={isEditCreatureOpen}
        setIsEditCreatureOpen={setIsEditCreatureOpen}
        HandleEndCombat={HandleEndCombat}
      />
      <img src={background} alt="Created by liuzishan - www.freepik.com" />

      <div className={`section-wrapper ${isEditCreatureOpen ? "hidden" : ""}`}>
        <div className={`section-wrapper ${openTab !== MAIN_TABS.SKILL_CHECK ? "hidden" : ""}`}>
          <SkillCheck resultText={openTab} level={level} />
        </div>

        <div className={`section-wrapper ${openTab !== MAIN_TABS.COMBAT ? "hidden" : ""}`}>
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
        ))}

        <div className={`section-wrapper ${openTab !== MAIN_TABS.TREASURE ? "hidden" : ""}`}>
          <Treasure resultText={openTab} level={level} />
        </div>
      </div>

      <div className={`section-wrapper ${!isEditCreatureOpen ? "hidden" : ""}`}>
        <EditCreature setIsEditCreatureOpen={setIsEditCreatureOpen} />
      </div>
    </div>
  );
}

export default Home;
