import React from "react";
import { useAuth } from "../../contexts/Auth";
import { useHistory } from "react-router-dom";

import { mainTabs } from "../../enums";
import Button from "../Button";

import "./styles.css";

function NaviBar({
  isPartyOpen,
  setIsPartyOpen,
  setOpenTab,
  isBestiaryOpen,
  setIsBestiaryOpen,
  isEditingCreature,
}) {
  const { Logout } = useAuth();
  const history = useHistory();

  async function HandleLogout() {
    await Logout();
    history.push("/login");
  }

  return (
    <div className="NaviBar-container">
      <section>
        <div>
          <h3>A</h3>
          <h3>SCENDANCE</h3>
          <h4>Ferramentas D&amp;D 5</h4>
        </div>
        <button onClick={HandleLogout}>Sair</button>
      </section>

      <section>
        <div
          className="sharp-button"
          onClick={() => {
            setIsPartyOpen(!isPartyOpen);
          }}
        >
          <div>
            <main />
            <aside />
          </div>
          <div>
            <main />
            <aside />
          </div>
          <div>
            <main>
              <h4>6 JOGADORES</h4>
              <h4>Nível 12</h4>
            </main>
            <aside />
          </div>
        </div>

        <Button onClick={() => setOpenTab(mainTabs.skillCheck)} text="Teste" />
        <Button
          onClick={() => setOpenTab(mainTabs.encounter)}
          text="Encontro"
        />
        <Button onClick={() => setOpenTab(mainTabs.reward)} text="Tesouro" />

        <div
          className="sharp-button"
          onClick={() => {
            setIsBestiaryOpen(!isBestiaryOpen);
          }}
        >
          <div>
            <aside />
            <main />
          </div>
          <div>
            <aside />
            <main />
          </div>
          <div>
            <aside />
            <main>
              <h4>BESTIÁRIO</h4>
              <h4>13 Criaturas</h4>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NaviBar;
