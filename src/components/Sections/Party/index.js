import React, { useState } from "react";
//  import api from "../../services/api";

import "./styles.css";

function Party({ onClick }) {
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className="Party-container">
      <div
        className="sharp-button"
        onClick={() => {
          setIsPartyOpen(true);
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
        <div>
          {/* button body */}
          <main>
            <h4>6 JOGADORES</h4>
            <h4>Nível 12</h4>
          </main>
          <aside />
        </div>
      </div>
      {isPartyOpen && (
        <div
          className="party-tab"
          onClick={() => {
            setIsPartyOpen(false);
          }}
        >
          FECHAR
        </div>
      )}
    </div>
  );
}

export default Party;
