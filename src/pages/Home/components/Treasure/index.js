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
  MATERIAL_QUANTITIES,
  materialQuantities,
  MATERIAL_WEIGHTS,
  materialWeigths,
  EQUIPMENT_TYPES,
  equipmentTypes,
  equipmentAttributes,
  UNCOMMON_ITEM_MIN_PRICE,
  CURSE_AFIX_PROB,
} from "../../../../data/treasureConstants";
import { creatureRarities, damageTypes } from "../../../../data/creatureConstants";
import * as utils from "../../../../utils";

import Panel from "../../../../components/Panel";
import Modal from "../../../../components/Modal";
import SelectButton from "../../../../components/SelectButton";
import Button from "../../../../components/Button";
import ResultBox from "../../../../components/ResultBox";
import Select from "../../../../components/Select";

import "./styles.css";

function Treasure({ resultText, level }) {
  const [hasResult, setHasResult] = useState(false);
  const [treasureType, setTreasureType] = useState(TREASURE_TYPES.MATERIAL);
  const [goldPiecesQuantity, setGoldPiecesQuantity] = useState(GOLD_PIECES_QUANTITIES.AVERAGE);
  const [materialPriceInflation, setMaterialPriceInflation] = useState(MATERIAL_PRICE_INFLATIONS.AVERAGE);
  const [materialQuantity, setMaterialQuantity] = useState(MATERIAL_QUANTITIES.AVERAGE);
  const [materialWeigth, setMaterialWeigths] = useState(MATERIAL_WEIGHTS.IRRELEVANT);
  const [equipmentType, setEquipmentType] = useState(null);
  const [equipmentRarity, setEquipmentRarity] = useState(null);
  const [equipmentDamageType, setEquipmentDamageType] = useState(null);
  const [equipmentAttribute, setEquipmentAttribute] = useState(null);

  const generatedItem = equipmentType && equipmentRarity ? getItemAfixes(level, equipmentType, equipmentRarity) : null;

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  // function calculateGoldPieces() {}

  function HandleSelectEquipmentType(updatedValue) {
    if (updatedValue === EQUIPMENT_TYPES.WEAPON || equipmentType === EQUIPMENT_TYPES.ARMOR) {
      setEquipmentAttribute(null);
    } else if (updatedValue === EQUIPMENT_TYPES.JEWELRY) {
      setEquipmentDamageType(null);
    }

    setEquipmentType(updatedValue);
  }

  function CheckFinalButtonValid() {
    if (treasureType === TREASURE_TYPES.GOLD_PIECES) {
      return true;
    } else if (treasureType === TREASURE_TYPES.MATERIAL) {
      return true;
    } else if (treasureType === TREASURE_TYPES.EQUIPMENT) {
      if (!equipmentType || !equipmentRarity) {
        return false;
      }

      if (equipmentType === EQUIPMENT_TYPES.WEAPON || equipmentType === EQUIPMENT_TYPES.ARMOR) {
        return equipmentDamageType;
      } else if (equipmentType === EQUIPMENT_TYPES.JEWELRY) {
        return equipmentAttribute;
      } else {
        return equipmentDamageType && equipmentAttribute;
      }
    }
  }

  return (
    <div className="Treasure-container">
      <section className="treasure-panels">
        <Panel
          title="Tipo"
          info={[
            { text: "Material pode ser usado para forja de equipamentos ou para recuperar abilidade perdida de equipamento" },
            { text: "" },
            {
              text: "Depedendo do tipo de equipamento desejado para o material, a ferramenta necessaria para sua forja será diferente. a CD e tempo necessário são determinados pela raridade. Esse tempo de ser dividido iqualmente entre o número de pessoas que estão forjando, mas todos tem que passar no teste para ter sucesso",
            },
          ]}
        >
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
        <>
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
          <section className="treasure-panels">
            <Panel
              title="Qunatidade e Peso"
              info={[{ text: "Quantifade é o número de vezes que uma unidade desse material pode ser usado para tentar transformar em equipamento" }]}
            >
              <main className="panel-select details">
                <Select
                  extraWidth={150}
                  value={materialQuantity}
                  onSelect={setMaterialQuantity}
                  options={materialQuantities}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  dropUp={true}
                />
                <Select
                  extraWidth={150}
                  value={materialWeigth}
                  onSelect={setMaterialWeigths}
                  options={materialWeigths}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  dropUp={true}
                />
              </main>
            </Panel>
          </section>
        </>
      )}
      {treasureType === TREASURE_TYPES.EQUIPMENT && (
        <>
          <section className="treasure-panels">
            <Panel
              title="Tipo e Raridade"
              info={[
                {
                  text: `Probabilidade de afixo especial em item: ${utils.turnValueIntoPercentageString(CURSE_AFIX_PROB)}`,
                },
                { text: "" },
                { text: "todos os itens gerados não poções são mágicos e precisam de sintonização" },
                { text: "" },
                { text: "Poções tem bônus de afixos dobrado, mas so duram até o final do próximo turno de quem a consumir" },
              ]}
            >
              <main className="panel-select details">
                <Select
                  extraWidth={150}
                  value={equipmentType}
                  onSelect={HandleSelectEquipmentType}
                  options={equipmentTypes}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                />
                <Select
                  extraWidth={150}
                  value={equipmentRarity}
                  onSelect={setEquipmentRarity}
                  options={creatureRarities}
                  optionDisplay={(o) => o.treasureDisplay}
                  optionValue={(o) => o.value}
                />
              </main>
            </Panel>
          </section>
          <section className="treasure-panels">
            <Panel title="Possível Tipo de Dano e Bônus de Atributo">
              <main className="panel-select details">
                <Select
                  extraWidth={150}
                  value={equipmentDamageType}
                  onSelect={setEquipmentDamageType}
                  options={damageTypes}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  isDisabled={!equipmentType || equipmentType === EQUIPMENT_TYPES.JEWELRY}
                  dropUp={true}
                />
                <Select
                  extraWidth={150}
                  value={equipmentAttribute}
                  onSelect={setEquipmentAttribute}
                  options={equipmentAttributes}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  isDisabled={!equipmentType || equipmentType === EQUIPMENT_TYPES.WEAPON || equipmentType === EQUIPMENT_TYPES.ARMOR}
                  dropUp={true}
                />
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
                    label: creatureRarities[index].treasureDisplay,
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
              <footer>
                <p>
                  Peso: {materialWeigths.find((mw) => mw.value === materialWeigth).resultDisplay}, Forja: CD {15} (
                  {materialQuantities.find((mq) => mq.value === materialQuantity).resultDisplay})
                </p>
                <div className="crafting-tools">
                  <span>Armas: Ferramentas de ferreiro</span>
                  <span>Armaduras: Ferramentas de ferreiro, ferramentas de costureiro, ferramentas de coureiro, ferramentas de sapateiro</span>
                  <span>Acessórios: Ferramentas de joalheiro</span>
                  <span>Poções: Suprimentos de Alquimista</span>
                </div>
              </footer>
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
          isDisabled={!CheckFinalButtonValid()}
        />
      </footer>
    </div>
  );
}

export default Treasure;
