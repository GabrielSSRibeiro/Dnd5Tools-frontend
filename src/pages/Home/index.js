import React from "react";
import { useAuth } from "../../contexts/Auth";
// import { useMyContext } from "../../contexts/myContext";
// import { useHistory } from "react-router-dom";
//  import api from "../../services/api";

import "./styles.css";

function Home({ history }) {
  const { Logout } = useAuth();
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  function GoToTab(tab) {
    history.push(`/${tab}`);
  }

  async function HandleLogout() {
    await Logout();
    history.push("/login");
  }

  return (
    <div className="Home-container">
      <div>
        <button onClick={() => GoToTab("SkillCheck")}>Teste</button>
        <button onClick={() => GoToTab("Encounter")}>Encontro</button>
        <button onClick={() => GoToTab("Reward")}>Recompensa</button>
      </div>
      <h1>ASCENDANCE</h1>
      <h3>Ferramentas D&amp;D 5</h3>
      <div>
        <button onClick={HandleLogout}>Sair</button>
      </div>
    </div>
  );
}

export default Home;
