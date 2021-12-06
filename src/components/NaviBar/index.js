import React from "react";
import { useAuth } from "../../contexts/Auth";
import { useHistory } from "react-router-dom";

import { mainTabs } from "../../enums";
import SelectButton from "../SelectButton";
import Party from "../Sections/Party";
import Bestiary from "../Sections/Bestiary";

import "./styles.css";

function NaviBar({ openTab, setOpenTab, isEditCreatureOpen, setIsEditCreatureOpen }) {
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
      {!isEditCreatureOpen && (
        <section>
          <Party />
          <SelectButton
            isLarge={true}
            isSelected={openTab === mainTabs.skillCheck}
            isLong={false}
            text="Teste"
            onClick={() => setOpenTab(mainTabs.skillCheck)}
          />
          <SelectButton
            isLarge={true}
            isSelected={openTab === mainTabs.combat}
            isLong={true}
            text="Combate"
            onClick={() => setOpenTab(mainTabs.combat)}
          />
          <SelectButton
            isLarge={true}
            isSelected={openTab === mainTabs.treasure}
            isLong={false}
            text="Tesouro"
            onClick={() => setOpenTab(mainTabs.treasure)}
          />
          <Bestiary setIsEditCreatureOpen={setIsEditCreatureOpen} />
        </section>
      )}
    </div>
  );
}

export default NaviBar;
