import React from "react";
import { useAuth } from "../../contexts/Auth";
import { useHistory } from "react-router-dom";

import SelectButton from "../SelectButton";
import Party from "../Sections/Party";
import Bestiary from "../Sections/Bestiary";

import "./styles.css";

function NaviBar({ setLevel, tabOptions, openTab, setOpenTab, isEditCreatureOpen, setIsEditCreatureOpen }) {
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
          <Party setLevel={setLevel} />
          <SelectButton
            isLarge={true}
            isSelected={openTab === tabOptions.SKILL_CHECK}
            isLong={false}
            text={tabOptions.SKILL_CHECK}
            onClick={() => setOpenTab(tabOptions.SKILL_CHECK)}
          />
          <SelectButton
            isLarge={true}
            isSelected={openTab === tabOptions.COMBAT}
            isLong={true}
            text={tabOptions.COMBAT}
            onClick={() => setOpenTab(tabOptions.COMBAT)}
          />
          <SelectButton
            isLarge={true}
            isSelected={openTab === tabOptions.TREASURE}
            isLong={false}
            text={tabOptions.TREASURE}
            onClick={() => setOpenTab(tabOptions.TREASURE)}
          />
          <Bestiary setIsEditCreatureOpen={setIsEditCreatureOpen} />
        </section>
      )}
    </div>
  );
}

export default NaviBar;
