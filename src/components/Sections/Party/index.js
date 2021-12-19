import React, { useState } from "react";
//  import api from "../../services/api";

import Select from "../../Select";
import CheckInput from "../../CheckInput";

import "./styles.css";

function Party() {
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  const [level, setlevel] = useState(1);
  const [selected, setselected] = useState(false);
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);
  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  function HandleSelect() {
    setselected(!selected);
  }

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
            <h5>6 JOGADORES</h5>
            <h6>Nível 12</h6>
          </main>
          <aside />
        </div>
      </div>
      {isPartyOpen && (
        <div className="party-tab">
          <header>
            <h5>6 JOGADORES</h5>
            <div>
              <h5>Nível</h5>
              <Select value={level} onSelect={setlevel} options={levels} />
              <div
                className="sharp-button"
                onClick={() => {
                  setIsPartyOpen(false);
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
                  <main />
                </div>
              </div>
            </div>
          </header>
          <main>Grupos</main>
          <CheckInput onClick={HandleSelect} isSelected={selected} />
        </div>
      )}
    </div>
  );
}

export default Party;
