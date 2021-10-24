import React from "react";
//  import api from "../../services/api";

import "./styles.css";

function SkillCheck({ history }) {
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  async function HandleBack() {
    history.push("/");
  }

  return (
    <div className="SkillCheck-container">
      <h1>Teste</h1>
      <div>
        <button onClick={HandleBack}>Voltar</button>
      </div>
    </div>
  );
}

export default SkillCheck;
