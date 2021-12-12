import React from "react";
import { useAuth } from "../../contexts/Auth";
import { useHistory } from "react-router-dom";

import SelectButton from "../SelectButton";
import Party from "../Sections/Party";
import Bestiary from "../Sections/Bestiary";

import "./styles.css";

function NaviBar({ tabOptions, openTab, setOpenTab, isEditCreatureOpen, setIsEditCreatureOpen }) {
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
            isSelected={openTab === tabOptions[0]}
            isLong={false}
            text={tabOptions[0]}
            onClick={() => setOpenTab(tabOptions[0])}
          />
          <SelectButton
            isLarge={true}
            isSelected={openTab === tabOptions[1]}
            isLong={true}
            text={tabOptions[1]}
            onClick={() => setOpenTab(tabOptions[1])}
          />
          <SelectButton
            isLarge={true}
            isSelected={openTab === tabOptions[2]}
            isLong={false}
            text={tabOptions[2]}
            onClick={() => setOpenTab(tabOptions[2])}
          />
          <Bestiary setIsEditCreatureOpen={setIsEditCreatureOpen} />
        </section>
      )}
    </div>
  );
}

export default NaviBar;
