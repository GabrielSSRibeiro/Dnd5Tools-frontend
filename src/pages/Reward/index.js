import React from "react";
//  import api from "../../services/api";

import "./styles.css";

function Reward({ history }) {
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
    <div className="Reward-container">
      <h1>Recompensa</h1>
      <div>
        <button onClick={HandleBack}>Voltar</button>
      </div>
    </div>
  );
}

export default Reward;
