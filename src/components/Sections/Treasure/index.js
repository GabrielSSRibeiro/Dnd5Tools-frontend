import React, { useState } from "react";
//  import api from "../../services/api";
import { treasureTypes, treasureQuantities } from "../../../Tables/treasure";

import Panel from "../../Panel";
import SelectButton from "../../SelectButton";
import Button from "../../Button";
import ResultBox from "../../ResultBox";

import "./styles.css";

function Treasure({ resultText }) {
  const [hasResult, setHasResult] = useState(true);
  const [treasureType, setTreasureType] = useState(null);
  const [goldPiecesQuantity, setGoldPiecesQuantity] = useState("");
  const [GoldPiecesResult, setGoldPiecesResult] = useState(null);

  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  function handleResult() {
    setHasResult(true);
  }

  return (
    <div className="Treasure-container">
      {!hasResult ? (
        <>
          <section>
            <Panel title="Tipo">
              <main className="panel-select">
                {treasureTypes.map((option) => (
                  <SelectButton
                    key={option}
                    isLarge={false}
                    isLong={false}
                    isSelected={treasureType === option}
                    text={option}
                    onClick={() => setTreasureType(option)}
                  />
                ))}
              </main>
            </Panel>
          </section>
          {treasureType === treasureTypes[0] && (
            <section>
              <Panel title="Quantidade">
                <main className="panel-select">
                  {treasureQuantities.map((option) => (
                    <SelectButton
                      key={option}
                      isLarge={false}
                      isLong={false}
                      isSelected={goldPiecesQuantity === option}
                      text={option}
                      onClick={() => setGoldPiecesQuantity(option)}
                    />
                  ))}
                </main>
              </Panel>
            </section>
          )}
          {treasureType === treasureTypes[1] && (
            <section>
              <Panel title="Quantidade">
                <main className="panel-select">
                  {treasureQuantities.map((option) => (
                    <SelectButton
                      key={option}
                      isLarge={false}
                      isLong={false}
                      isSelected={goldPiecesQuantity === option}
                      text={option}
                      onClick={() => setGoldPiecesQuantity(option)}
                    />
                  ))}
                </main>
              </Panel>
            </section>
          )}
          {treasureType === treasureTypes[2] && (
            <>
              <section>
                <Panel title="Quantidade">
                  <main className="panel-select">
                    {treasureQuantities.map((option) => (
                      <SelectButton
                        key={option}
                        isLarge={false}
                        isLong={false}
                        isSelected={goldPiecesQuantity === option}
                        text={option}
                        onClick={() => setGoldPiecesQuantity(option)}
                      />
                    ))}
                  </main>
                </Panel>
              </section>
              <section>
                <Panel title="Quantidade">
                  <main className="panel-select">
                    {treasureQuantities.map((option) => (
                      <SelectButton
                        key={option}
                        isLarge={false}
                        isLong={false}
                        isSelected={goldPiecesQuantity === option}
                        text={option}
                        onClick={() => setGoldPiecesQuantity(option)}
                      />
                    ))}
                  </main>
                </Panel>
              </section>
            </>
          )}
        </>
      ) : (
        <section>
          <ResultBox />
        </section>
      )}
      <footer>
        <Button
          text={hasResult ? `Rodar ${resultText}` : `Rodar ${treasureType || "Novo"}`}
          onClick={() => (hasResult ? setHasResult(false) : handleResult(treasureType))}
        />
      </footer>
    </div>
  );
}

export default Treasure;
