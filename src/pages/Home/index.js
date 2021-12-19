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
  const [isEditCreatureOpen, setIsEditCreatureOpen] = useState(false);
  const [level, setLevel] = useState(1);

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="Home-container">
      <NaviBar
        level={level}
        setLevel={setLevel}
        tabOptions={MAIN_TABS}
        openTab={openTab}
        setOpenTab={setOpenTab}
        isEditCreatureOpen={isEditCreatureOpen}
        setIsEditCreatureOpen={setIsEditCreatureOpen}
      />
      <img src={background} alt={<a href="https://www.freepik.com/photos/people">People photo created by liuzishan - www.freepik.com</a>} />
      {!isEditCreatureOpen ? (
        <>
          {openTab === MAIN_TABS.SKILL_CHECK && <SkillCheck resultText={openTab} />}
          {openTab === MAIN_TABS.COMBAT && <Combat resultText={openTab} />}
          {openTab === MAIN_TABS.TREASURE && <Treasure resultText={openTab} level={level} />}
        </>
      ) : (
        <EditCreature setIsEditCreatureOpen={setIsEditCreatureOpen} />
      )}
    </div>
  );
}

export default Home;
