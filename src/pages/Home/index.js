import React, { useState } from "react";
import { mainTabs } from "../../enums";
//  import api from "../../services/api";

import NaviBar from "../../components/NaviBar";
import SkillCheck from "../../components/Sections/SkillCheck";
import Combat from "../../components/Sections/Combat";
import Treasure from "../../components/Sections/Treasure";
import EditCreature from "../../components/Sections/EditCreature";

import background from "../../assets/background.png";
import "./styles.css";

function Home() {
  const [openTab, setOpenTab] = useState(mainTabs.combat);
  const [isEditCreatureOpen, setIsEditCreatureOpen] = useState(false);

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="Home-container">
      <NaviBar openTab={openTab} setOpenTab={setOpenTab} isEditCreatureOpen={isEditCreatureOpen} setIsEditCreatureOpen={setIsEditCreatureOpen} />
      <img src={background} alt={<a href="https://www.freepik.com/photos/people">People photo created by liuzishan - www.freepik.com</a>} />
      {!isEditCreatureOpen ? (
        <>
          {openTab === mainTabs.skillCheck && <SkillCheck />}
          {openTab === mainTabs.combat && <Combat />}
          {openTab === mainTabs.treasure && <Treasure />}
        </>
      ) : (
        <EditCreature setIsEditCreatureOpen={setIsEditCreatureOpen} />
      )}
    </div>
  );
}

export default Home;
