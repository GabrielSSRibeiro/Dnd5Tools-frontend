import React from "react";
//  import api from "../../services/api";

import Button from "../../Button";

import "./styles.css";

function EditCreature({ setIsEditCreatureOpen }) {
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="EditCreature-container">
      <Button text="Salvar" onClick={() => setIsEditCreatureOpen(false)} />
    </div>
  );
}

export default EditCreature;
