import React, { useState } from "react";
//  import api from "../../services/api";

import { LEVELS } from "../../../Tables/party";

import Button from "../../Button";
import Select from "../../Select";
import CheckInput from "../../CheckInput";

import "./styles.css";

function Party({ level, setLevel }) {
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [isEditCharacterOpen, setIsEditCharacterOpen] = useState(false);
  const [characters, setCharacters] = useState([]);
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  function HandleSelect() {
    setSelected(!selected);
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
            <h5>{characters.length} JOGADORES</h5>
            <h6>Nível {level}</h6>
          </main>
          <aside />
        </div>
      </div>
      {isPartyOpen && (
        <div className="party-tab">
          <header>
            <h5>{characters.length} JOGADORES</h5>
            <div>
              <h5>Nível</h5>
              <Select value={level} onSelect={setLevel} options={LEVELS} />
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

          <main>
            <aside>
              <Button text="Adicionar Jogador" onClick={() => setIsEditCharacterOpen(true)} />
            </aside>
            <div className="">
              <h5>Grupo</h5>
              <div className="">
                <input onChange={(e) => {}} placeholder="" value={""}></input>
                <button onClick={() => {}}>LIMPAR</button>
              </div>
              <main>
                <CheckInput onClick={HandleSelect} isSelected={selected} />
              </main>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default Party;
