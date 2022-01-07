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

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="Home-container">
      <NaviBar
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
              setIsSelectingParty={setIsSelectingParty}
              setIsSelectingBestiary={setIsSelectingBestiary}
              setIsPartyOpen={setIsPartyOpen}
              setIsBestiaryOpen={setIsBestiaryOpen}
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
