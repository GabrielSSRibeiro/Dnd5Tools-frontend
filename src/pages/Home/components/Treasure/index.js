import React, { useState } from "react";
//  import api from "../../services/api";
import {
  getGoldPiecesAmount,
  ITEMS_CRAFT_TIMES,
  getItemBuyPrices,
  getItemSellPrices,
  getItemCraftBuyPrices,
  getItemCraftSellPrices,
  getMaterialBuyPrices,
  getMaterialSellPrices,
  getItemAfixes,
} from "./utils";
import {
  DEFAULT_TREASURE_TYPE,
  DEFAULT_GOLD_PIECES_QUANTITIES,
  DEFAULT_MATERIAL_PRICE_INFLATIONS,
  TREASURE_TYPES,
  GOLD_PIECES_QUANTITIES,
  MATERIAL_PRICE_INFLATIONS,
  EQUIPMENT_TYPES,
  EQUIPMENT_RARITIES,
  UNCOMMON_ITEM_MIN_PRICE,
  PRIMARY_AFIX_PROB,
  SECONDARY_AFIX_PROB,
  CURSE_AFIX_PROB,
} from "../../../../data/treasureConstants";
import * as utils from "../../../../utils";

import Panel from "../../../../components/Panel";
import SelectButton from "../../../../components/SelectButton";
import Button from "../../../../components/Button";
import ResultBox from "../../../../components/ResultBox";

import "./styles.css";

function Treasure({ resultText, level }) {
  const [hasResult, setHasResult] = useState(false);
  const [treasureType, setTreasureType] = useState(DEFAULT_TREASURE_TYPE);
  const [goldPiecesQuantity, setGoldPiecesQuantity] = useState(DEFAULT_GOLD_PIECES_QUANTITIES);
  const [materialPriceInflation, setMaterialPriceInflation] = useState(DEFAULT_MATERIAL_PRICE_INFLATIONS);
  const [equipmentType, setEquipmentType] = useState(null);
  const [equipmentRarity, setEquipmentRarity] = useState(null);

  const treasureTypes = { GOLD_PIECES: TREASURE_TYPES[0], MATERIAL: TREASURE_TYPES[1], EQUIPMENT: TREASURE_TYPES[2] };
  const generatedItem = getItemAfixes(level, equipmentType, equipmentRarity);

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  // function calculateGoldPieces() {}

  function CheckFinalButtonDisable() {
    let isDisabled = false;

    if (treasureType === treasureTypes.EQUIPMENT && (!equipmentType || !equipmentRarity)) {
      isDisabled = true;
    }

    return isDisabled;
  }

  return (
    <div className="Treasure-container">
      {!hasResult ? (
        <>
          <section className="treasure-panels">
            <Panel title="Tipo">
              <main className="panel-select">
                {TREASURE_TYPES.map((option) => (
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
          {treasureType === treasureTypes.GOLD_PIECES && (
            <section className="treasure-panels">
              <Panel title="Quantidade">
                <main className="panel-select">
                  {GOLD_PIECES_QUANTITIES.map((option) => (
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
          {treasureType === treasureTypes.MATERIAL && (
            <section className="treasure-panels">
              <Panel title="Pre??o" info={[{ text: `Pre??o m??nimo de item incomum: ${UNCOMMON_ITEM_MIN_PRICE} PO` }]}>
                <main className="panel-select">
                  {MATERIAL_PRICE_INFLATIONS.map((option) => (
                    <SelectButton
                      key={option}
                      isLarge={false}
                      isLong={false}
                      isSelected={materialPriceInflation === option}
                      text={option}
                      onClick={() => setMaterialPriceInflation(option)}
                    />
                  ))}
                </main>
              </Panel>
            </section>
          )}
          {treasureType === treasureTypes.EQUIPMENT && (
            <>
              <section className="treasure-panels">
                <Panel
                  title="Tipo do Item"
                  info={[
                    {
                      text: `Probabilidade de afixo prim??rio em item: ${utils.turnValueIntoPercentageString(PRIMARY_AFIX_PROB)}`,
                    },
                    {
                      text: `Probabilidade de afixo secund??rio em item: ${utils.turnValueIntoPercentageString(SECONDARY_AFIX_PROB)}`,
                    },
                    {
                      text: `Probabilidade de afixo amaldi??oado em item: ${utils.turnValueIntoPercentageString(CURSE_AFIX_PROB)}`,
                    },
                  ]}
                >
                  <main className="panel-select">
                    {EQUIPMENT_TYPES.map((option) => (
                      <SelectButton
                        key={option}
                        isLarge={false}
                        isLong={false}
                        isSelected={equipmentType === option}
                        text={option}
                        onClick={() => setEquipmentType(option)}
                      />
                    ))}
                  </main>
                </Panel>
              </section>
              <section className="treasure-panels">
                <Panel title="Raridade">
                  <main className="panel-select">
                    {EQUIPMENT_RARITIES.map((option) => (
                      <SelectButton
                        key={option}
                        isLarge={false}
                        isLong={false}
                        isSelected={equipmentRarity === option}
                        text={option}
                        onClick={() => setEquipmentRarity(option)}
                      />
                    ))}
                  </main>
                </Panel>
              </section>
            </>
          )}
        </>
      ) : (
        <>
          {treasureType === treasureTypes.GOLD_PIECES && (
            <section className="result-tables">
              <ResultBox
                headers={["Tesouro"]}
                highlightTopRow={true}
                values={[{ top: getGoldPiecesAmount(goldPiecesQuantity), bottom: "Pe??as de Ouro" }]}
              />
            </section>
          )}
          {treasureType === treasureTypes.MATERIAL && (
            <>
              <section className="result-tables">
                <ResultBox
                  headers={["Pre??o", "Material"]}
                  subHeaders={["Comprar", "Vender"]}
                  resultBackgroundColumn={true}
                  values={getMaterialBuyPrices(materialPriceInflation).map((item, index) => ({
                    label: EQUIPMENT_RARITIES[index],
                    top: item() + " PO",
                    bottom: getMaterialSellPrices()[index]() + " PO",
                  }))}
                />
              </section>
              <section className="result-tables">
                <ResultBox
                  headers={["Pre??o / Tempo", "Forja de Item"]}
                  subHeaders={["Comprar / Dias", "Vender / Dias"]}
                  resultBackgroundColumn={true}
                  values={getItemCraftBuyPrices(materialPriceInflation).map((item, index) => ({
                    label: null,
                    top: item() + " PO / " + ITEMS_CRAFT_TIMES[index]() + " d",
                    bottom: getItemCraftSellPrices()[index]() + " PO / " + ITEMS_CRAFT_TIMES[index]() + " d",
                  }))}
                />
              </section>
              <section className="result-tables">
                <ResultBox
                  headers={["Pre??o", "Item Pronto"]}
                  subHeaders={["Comprar", "Vender"]}
                  resultBackgroundColumn={true}
                  values={getItemBuyPrices(materialPriceInflation).map((item, index) => ({
                    label: null,
                    top: item() + " PO",
                    bottom: getItemSellPrices()[index]() + " PO",
                  }))}
                />
              </section>
            </>
          )}
          {treasureType === treasureTypes.EQUIPMENT && (
            <section className="result-tables">
              <ResultBox
                headers={generatedItem.name}
                highlightSubHeaders={true}
                highlightTopRow={true}
                values={generatedItem.afixes.map((afix) => ({
                  label: null,
                  top: afix.bonus > 0 ? "+" + afix.bonus : afix.bonus,
                  bottom: afix.name,
                }))}
              />
            </section>
          )}
        </>
      )}
      <footer>
        <Button
          text={!hasResult ? `Rodar ${treasureType || resultText}` : "Rodar Novo"}
          onClick={() => (hasResult ? setHasResult(false) : setHasResult(true))}
          isDisabled={CheckFinalButtonDisable()}
        />
      </footer>
    </div>
  );
}

export default Treasure;
