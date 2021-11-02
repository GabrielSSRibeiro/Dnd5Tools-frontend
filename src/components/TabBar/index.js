import React from "react";
import { mainTabs } from "../../enums";

import Button from "../Button";

import "./styles.css";

function TabBar({ setOpenTab }) {
  return (
    <div className="TabBar-container">
      <button onClick={() => {}}>Jogadores</button>
      <button onClick={() => setOpenTab(mainTabs.skillCheck)}>Teste</button>
      <button onClick={() => setOpenTab(mainTabs.encounter)}>Encontro</button>
      <button onClick={() => setOpenTab(mainTabs.reward)}>Recompensa</button>
      <button onClick={() => {}}>Bestiário</button>
    </div>
  );
}

export default TabBar;
