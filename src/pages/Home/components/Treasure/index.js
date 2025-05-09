import React, { useState, useMemo } from "react";
import { GetDCValue } from "../../../../helpers/creatureHelper";
import {
  getGoldPiecesAmount,
  ITEMS_CRAFT_TIMES,
  getItemBuyPrices,
  getItemSellPrices,
  getItemCraftBuyPrices,
  getItemCraftSellPrices,
  getMaterialBuyPrices,
  getMaterialSellPrices,
  GetMaterialWeightValue,
  GetMaterialQuantityValue,
  getItemAfixes,
  getWeaponAfixes,
  getArmorAfixes,
  getJewelryAfixes,
} from "../../../../helpers/treasureHelper";
import {
  TREASURE_TYPES,
  treasureTypes as tt,
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
} from "../../../../constants/treasureConstants";
import { creatureRarities, CREATURE_RARITIES, damageTypes } from "../../../../constants/creatureConstants";
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
  const treasureTypes = useMemo(() => tt.filter((t) => t.value !== TREASURE_TYPES.EQUIPMENT), []);

  const generatedItem =
    hasResult && treasureType === TREASURE_TYPES.EQUIPMENT
      ? getItemAfixes(equipmentType, equipmentRarity, equipmentDamageType, equipmentAttribute)
      : null;

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
            {
              text: "Material pode ser usado para forja de equipamentos ou para recuperar habilidade perdida de equipamento. Na Forja, primeiro se dedica o tempo e depois se faz o teste. Para identificar a raridade de um material, é recomendado um teste de dificuldade média(natureza ou outro)",
            },
            { text: "" },
            {
              text: "Depedendo do tipo de equipamento desejado para o material, a ferramenta necessaria para sua forja será diferente. a CD e tempo necessário são determinados pela raridade. Um dia de forja é o equivalente a 8 horas, o limite diárío sem exaustão, e pode ser dividido iqualmente entre o número de pessoas que estão forjando, mas todos tem que passar no teste para ter sucesso",
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
            <Panel
              title="Preço"
              info={[
                { text: `Preço mínimo de item incomum: ${UNCOMMON_ITEM_MIN_PRICE} PO` },
                { text: "" },
                { text: "PO de forja equivale a valor de resurcos necessários para componentes de forja" },
              ]}
            >
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
              title="Quantidade e Peso"
              info={[
                {
                  text: "Quantifade é o número de vezes que uma unidade do material adquirido pode ser usado para tentar transformar em equipamento",
                },
                {
                  text: "Todos os usos sao consumidos em um sucesso",
                },
              ]}
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
              className="equipment-type"
              info={[
                { text: "Todos os itens não consumíveis gerados são mágicos e precisam de sintonização" },
                {
                  text: "1 vez por descanso longo, pode re-sincronizar um item com cargas, tornando o total atual o resultado de 1d(x + total de habilidades) - total de habilidades, mínimo 0",
                },
                { text: "" },
                {
                  text: "Equipamentos lendários só podem ser criados como tesouro de criaturas lendárias",
                },
                { text: "" },
                {
                  text: `Probabilidade de afixo instável: ${utils.turnValueIntoPercentageString(CURSE_AFIX_PROB)}`,
                },
                {
                  text:
                    "Probabilidade de afixo em armas: " +
                    getWeaponAfixes()
                      .map((a) => `${a.infoDisplay} (${utils.turnValueIntoPercentageString(a.probability)})`)
                      .join(", "),
                },
                {
                  text:
                    "Probabilidade de afixo em armadura: " +
                    getArmorAfixes()
                      .map((a) => `${a.infoDisplay} (${utils.turnValueIntoPercentageString(a.probability)})`)
                      .join(", "),
                },
                {
                  text:
                    "Probabilidade de afixo em acessório: " +
                    getJewelryAfixes()
                      .map((a) => `${a.infoDisplay} (${utils.turnValueIntoPercentageString(a.probability)})`)
                      .join(", "),
                },
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
                  options={creatureRarities.filter((r) => r.value !== CREATURE_RARITIES.LEGENDARY)}
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
                  headers={["Preço / Dias / CD", "Forja de Item"]}
                  subHeaders={["Comprar", "Vender"]}
                  resultBackgroundColumn={true}
                  values={getItemCraftBuyPrices(materialPriceInflation).map((item, index) => ({
                    label: null,
                    top: item() + " PO / " + ITEMS_CRAFT_TIMES[index]() + "d / CD " + GetDCValue(creatureRarities[index].value, 10),
                    bottom: getItemCraftSellPrices()[index]() + " PO",
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
                  Peso: {GetMaterialWeightValue(materialWeigth)}, Forja: {GetMaterialQuantityValue(materialQuantity)}
                </p>
                <div className="crafting-tools">
                  <span>
                    <span className="label">Armas: </span>Ferramentas de ferreiro
                  </span>
                  <span>
                    <span className="label">Armaduras: </span>Ferramentas de ferreiro, ferramentas de coureiro, ferramentas de costureiro
                  </span>
                  <span>
                    <span className="label">Acessórios: </span>Ferramentas de joalheiro
                  </span>
                  <span>
                    <span className="label">Poçoes: </span>Suprimentos de Alquimista
                  </span>
                  <span>
                    <span className="label">Elixir de efeito: </span>Suprimentos de cervejeiro, suprimentos de Alquimista
                  </span>
                  <span>
                    <span className="label">Pergaminho de magia: </span>Suprimentos de caligrafia, ferramentas de cartógrafo
                  </span>
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
                top: afix.bonus,
                bottom: afix.name,
              }))}
            />
          )}
        </Modal>
      )}
      <footer>
        <Button
          text={`Rodar ${treasureTypes.find((tt) => tt.value === treasureType).display || resultText}`}
          onClick={() => setHasResult(!hasResult)}
          isDisabled={!CheckFinalButtonValid()}
        />
      </footer>
    </div>
  );
}

export default Treasure;
