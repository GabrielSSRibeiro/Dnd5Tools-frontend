import React from "react";
import { useAuth } from "../../contexts/Auth";
import { useHistory } from "react-router-dom";

import "./styles.css";

function NaviBar() {
  const { Logout } = useAuth();
  const history = useHistory();

  async function HandleLogout() {
    await Logout();
    history.push("/login");
  }

  return (
    <div className="NaviBar-container">
      <div>
        <h3>A</h3>
        <h3>SCENDANCE</h3>
        <h4>Ferramentas D&amp;D 5</h4>
      </div>
      <button onClick={HandleLogout}>Sair</button>
    </div>
  );
}

export default NaviBar;
