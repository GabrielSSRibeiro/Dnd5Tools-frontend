import React, { useState } from "react";
import { mainTabs } from "../../enums";
//  import api from "../../services/api";

import NaviBar from "../../components/NaviBar";
import SkillCheck from "../../components/Sections/SkillCheck";
import Encounter from "../../components/Sections/Encounter";
import Treasure from "../../components/Sections/Treasure";

import background from "../../assets/background.png";
import "./styles.css";

function Home() {
  const [openTab, setOpenTab] = useState(mainTabs.encounter);
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  const [isBestiaryOpen, setIsBestiaryOpen] = useState(false);
  const [isEditingCreature, setIsEditingCreature] = useState(false);

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="Home-container">
      <NaviBar
        isPartyOpen={isPartyOpen}
        setIsPartyOpen={setIsPartyOpen}
        setOpenTab={setOpenTab}
        isBestiaryOpen={isBestiaryOpen}
        setIsBestiaryOpen={setIsBestiaryOpen}
        setIsPBestiaryOpen={setIsBestiaryOpen}
        isEditingCreature={isEditingCreature}
      />
      <img
        src={background}
        alt={
          <a href="https://www.freepik.com/photos/people">
            People photo created by liuzishan - www.freepik.com
          </a>
        }
      />
      {openTab === mainTabs.skillCheck && <SkillCheck />}
      {openTab === mainTabs.encounter && <Encounter />}
      {openTab === mainTabs.reward && <Treasure />}
    </div>
  );
}

export default Home;
