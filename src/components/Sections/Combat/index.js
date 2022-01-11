import React from "react";
//  import api from "../../services/api";

import Button from "../../Button";

import "./styles.css";

function Combat({ combat, HandleEndCombat }) {
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="Combat-container">
      <h1>Em Desenvolvimento</h1>
      <Button text="Finalizar" onClick={HandleEndCombat} />
    </div>
  );
}

export default Combat;
