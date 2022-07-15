import React from "react";
//  import api from "../../services/api";

import "./styles.css";

function Combat({ combat }) {
  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="Combat-container">
      <h1>Em Desenvolvimento</h1>
      <h2>Combate: {combat.selectedCreatures.length}</h2>
    </div>
  );
}

export default Combat;
