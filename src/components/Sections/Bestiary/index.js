import React, { useState } from "react";
//  import api from "../../services/api";
import { levels, environments, types, sizes } from "../../../tables";

import Button from "../../Button";
import Select from "../../Select";

import "./styles.css";

function Bestiary({ setIsEditCreatureOpen }) {
  const [isBestiaryOpen, setIsBestiaryOpen] = useState(false);

  const creatures = [
    { name: "Criatura 1" },
    { name: "Criatura 2" },
    { name: "Criatura 3" },
    { name: "Criatura 4" },
    { name: "Criatura 5" },
    { name: "Criatura 6" },
  ];
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
          <main>
            <aside>
              <Button text="Adicionar Criatura" onClick={() => setIsEditCreatureOpen(true)} />
            </aside>
            <div className="bestiary-filters">
              <h5>Filtrar Por</h5>
              <div className="filter-text">
                <input onClick={() => {}} placeholder="Filtrar por nome"></input>
                <button>LIMPAR</button>
              </div>
              <main>
                <Select extraWidth={20} value={"Nível"} setValue={() => {}} options={levels} />
                <Select extraWidth={60} value={"Subterraneo"} setValue={() => {}} options={environments} />
                <Select extraWidth={60} value={"Monstruosidade"} setValue={() => {}} options={types} />
                <Select extraWidth={20} value={"Pequeno"} setValue={() => {}} options={sizes} />
              </main>
            </div>
            {/* <div className="bestiary-list">
              {creatures.map((creature) => (
                <div key={creature.name}></div>
              ))}
            </div> */}
          </main>
        </div>
      )}
    </div>
  );
}

export default Bestiary;
