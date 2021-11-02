import React, { useState } from "react";
import { mainTabs } from "../../enums";
//  import api from "../../services/api";

import NaviBar from "../../components/NaviBar";
import TabBar from "../../components/TabBar";
import SkillCheck from "../../components/Sections/SkillCheck";
import Encounter from "../../components/Sections/Encounter";
import Reward from "../../components/Sections/Reward";

import background from "../../assets/background.png";
import "./styles.css";

function Home() {
  const [openTab, setOpenTab] = useState(mainTabs.encounter);

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="Home-container">
      <NaviBar />
      <TabBar setOpenTab={setOpenTab} />
      <img src={background} alt="background" />
      {openTab === mainTabs.skillCheck && <SkillCheck />}
      {openTab === mainTabs.encounter && <Encounter />}
      {openTab === mainTabs.reward && <Reward />}
    </div>
  );
}

export default Home;
