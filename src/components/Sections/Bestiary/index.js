import React, { useState } from "react";
//  import api from "../../services/api";

import "./styles.css";

function Bestiary({ setShowCompleteNaviBar }) {
  const [isBestiaryOpen, setIsBestiaryOpen] = useState(false);
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="Bestiary-container">
      <div
        className="sharp-button"
        onClick={() => {
          setIsBestiaryOpen(true);
        }}
      >
        {/* border 2 */}
        <div>
          <aside />
          <main />
        </div>
        {/* border 1 */}
        <div>
          <aside />
          <main />
        </div>
        {/* button body */}
        <div>
          <aside />
          <main>
            <h4>BESTIÁRIO</h4>
            <h4>13 Criaturas</h4>
          </main>
        </div>
      </div>
      {isBestiaryOpen && (
        <div
          className="bestiary-tab"
          onClick={() => {
            setIsBestiaryOpen(false);
          }}
        >
          FECHAR
        </div>
      )}
    </div>
  );
}

export default Bestiary;
