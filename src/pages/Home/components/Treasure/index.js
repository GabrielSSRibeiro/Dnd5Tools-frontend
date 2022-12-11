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
  TREASURE_TYPES,
  treasureTypes,
  GOLD_PIECES_QUANTITIES,
  goldPiecesQuantities,
  MATERIAL_PRICE_INFLATIONS,
  materialPriceInflations,
  equipmentTypes,
  equipmentRarities,
  UNCOMMON_ITEM_MIN_PRICE,
  PRIMARY_AFIX_PROB,
  SECONDARY_AFIX_PROB,
  CURSE_AFIX_PROB,
} from "../../../../data/treasureConstants";
import * as utils from "../../../../utils";

import Panel from "../../../../components/Panel";
import Modal from "../../../../components/Modal";
import SelectButton from "../../../../components/SelectButton";
import Button from "../../../../components/Button";
import ResultBox from "../../../../components/ResultBox";

import "./styles.css";

function Treasure({ resultText, level }) {
  const [hasResult, setHasResult] = useState(false);
  const [treasureType, setTreasureType] = useState(TREASURE_TYPES.MATERIAL);
  const [goldPiecesQuantity, setGoldPiecesQuantity] = useState(GOLD_PIECES_QUANTITIES.AVERAGE);
  const [materialPriceInflation, setMaterialPriceInflation] = useState(MATERIAL_PRICE_INFLATIONS.AVERAGE);
  const [equipmentType, setEquipmentType] = useState(null);
  const [equipmentRarity, setEquipmentRarity] = useState(null);

  const generatedItem = equipmentType && equipmentRarity ? getItemAfixes(level, equipmentType, equipmentRarity) : null;

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  // function calculateGoldPieces() {}

  function CheckFinalButtonDisable() {
    let isDisabled = false;

    if (treasureType === TREASURE_TYPES.EQUIPMENT && (!equipmentType || !equipmentRarity)) {
      isDisabled = true;
    }

    return isDisabled;
  }

  return (
    <div className="Treasure-container">
      <section className="treasure-panels">
        <Panel title="Tipo">
          <main className="panel-select">
            {treasureTypes.map((option) => (
              <SelectButton
                key={option.value}
                isLarge={false}
                isLong={false}
                isSelected={treasureType === option.value}
                text={option.display}
                onClick={() => setTreasureType(option.value)}
              />
            ))}
          </main>
        </Panel>
      </section>
      {treasureType === TREASURE_TYPES.GOLD_PIECES && (
        <section className="treasure-panels">
          <Panel title="Quantidade">
            <main className="panel-select">
              {goldPiecesQuantities.map((option) => (
                <SelectButton
                  key={option.value}
                  isLarge={false}
                  isLong={false}
                  isSelected={goldPiecesQuantity === option.value}
                  text={option.display}
                  onClick={() => setGoldPiecesQuantity(option.value)}
                />
              ))}
            </main>
          </Panel>
        </section>
      )}
      {treasureType === TREASURE_TYPES.MATERIAL && (
        <section className="treasure-panels">
          <Panel title="Preço" info={[{ text: `Preço mínimo de item incomum: ${UNCOMMON_ITEM_MIN_PRICE} PO` }]}>
            <main className="panel-select">
              {materialPriceInflations.map((option) => (
                <SelectButton
                  key={option.value}
                  isLarge={false}
                  isLong={false}
                  isSelected={materialPriceInflation === option.value}
                  text={option.display}
                  onClick={() => setMaterialPriceInflation(option.value)}
                />
              ))}
            </main>
          </Panel>
        </section>
      )}
      {treasureType === TREASURE_TYPES.EQUIPMENT && (
        <>
          <section className="treasure-panels">
            <Panel
              title="Tipo do Item"
              info={[
                {
                  text: `Probabilidade de afixo primário em item: ${utils.turnValueIntoPercentageString(PRIMARY_AFIX_PROB)}`,
                },
                {
                  text: `Probabilidade de afixo secundário em item: ${utils.turnValueIntoPercentageString(SECONDARY_AFIX_PROB)}`,
                },
                {
                  text: `Probabilidade de afixo amaldiçoado em item: ${utils.turnValueIntoPercentageString(CURSE_AFIX_PROB)}`,
                },
              ]}
            >
              <main className="panel-select">
                {equipmentTypes.map((option) => (
                  <SelectButton
                    key={option.value}
                    isLarge={false}
                    isLong={false}
                    isSelected={equipmentType === option.value}
                    text={option.display}
                    onClick={() => setEquipmentType(option.value)}
                  />
                ))}
              </main>
            </Panel>
          </section>
          <section className="treasure-panels">
            <Panel
              title="Raridade"
              info={[
                {
                  text: "lendários só podem vir de criaturas e tem afixos além da habilidade única infundida",
                },
              ]}
            >
              <main className="panel-select">
                {equipmentRarities.map((option) => (
                  <SelectButton
                    key={option.value}
                    isLarge={false}
                    isLong={false}
                    isSelected={equipmentRarity === option.value}
                    text={option.display}
                    onClick={() => setEquipmentRarity(option.value)}
                  />
                ))}
              </main>
            </Panel>
          </section>
        </>
      )}
      {hasResult && (
        <Modal
          title={treasureTypes.find((tt) => tt.value === treasureType).display}
          onClickToClose={() => setHasResult(!hasResult)}
          className="result-tables"
        >
          {treasureType === TREASURE_TYPES.GOLD_PIECES && (
            <ResultBox
              headers={["Tesouro"]}
              highlightTopRow={true}
              values={[{ top: getGoldPiecesAmount(goldPiecesQuantity), bottom: "Peças de Ouro" }]}
            />
          )}
          {treasureType === TREASURE_TYPES.MATERIAL && (
            <div className="modal-materials-wrapper">
              <div className="modal-materials">
                <ResultBox
                  headers={["Preço", "Material"]}
                  subHeaders={["Comprar", "Vender"]}
                  resultBackgroundColumn={true}
                  values={getMaterialBuyPrices(materialPriceInflation).map((item, index) => ({
                    label: equipmentRarities[index].display,
                    top: item() + " PO",
                    bottom: getMaterialSellPrices()[index]() + " PO",
                  }))}
                />
              </div>
              <div className="modal-materials">
                <ResultBox
                  headers={["Preço / Tempo", "Forja de Item"]}
                  subHeaders={["Comprar / Dias", "Vender / Dias"]}
                  resultBackgroundColumn={true}
                  values={getItemCraftBuyPrices(materialPriceInflation).map((item, index) => ({
                    label: null,
                    top: item() + " PO / " + ITEMS_CRAFT_TIMES[index]() + " d",
                    bottom: getItemCraftSellPrices()[index]() + " PO / " + ITEMS_CRAFT_TIMES[index]() + " d",
                  }))}
                />
              </div>
              <div className="modal-materials">
                <ResultBox
                  headers={["Preço", "Item Pronto"]}
                  subHeaders={["Comprar", "Vender"]}
                  resultBackgroundColumn={true}
                  values={getItemBuyPrices(materialPriceInflation).map((item, index) => ({
                    label: null,
                    top: item() + " PO",
                    bottom: getItemSellPrices()[index]() + " PO",
                  }))}
                />
              </div>
            </div>
          )}
          {treasureType === TREASURE_TYPES.EQUIPMENT && (
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
          )}
        </Modal>
      )}
      <footer>
        <Button
          text={`Rodar ${treasureTypes.find((tt) => tt.value === treasureType).display || resultText}`}
          onClick={() => (hasResult ? setHasResult(false) : setHasResult(true))}
          isDisabled={CheckFinalButtonDisable()}
        />
      </footer>
    </div>
  );
}

export default Treasure;
