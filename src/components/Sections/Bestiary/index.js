import React, { useState } from "react";
//  import api from "../../services/api";

import "./styles.css";

function Bestiary() {
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
            <h5>BESTIÁRIO</h5>
            <h5>13 Criaturas</h5>
          </main>
        </div>
      </div>
      {isBestiaryOpen && (
        <div className="bestiary-tab">
          <header>
            <div>
              <div
                className="sharp-button"
                onClick={() => {
                  setIsBestiaryOpen(false);
                }}
              >
                {/* border 2 */}
                <div>
                  <main />
                  <aside />
                </div>
                {/* border 1 */}
                <div>
                  <main />
                  <aside />
                </div>
                {/* button body */}
                <div>
                  <main />
                  <aside />
                </div>
              </div>
              <h5>13 Criaturas</h5>
            </div>
            <h5>BESTIÁRIO</h5>
          </header>
        </div>
      )}
    </div>
  );
}

export default Bestiary;
