import React, { useState } from "react";
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
              text: "Material pode ser usado para forja de equipamentos ou para recuperar habilidade perdida de equipamento. Na Forja, primeiro se dedica o tempo e depois se faz o teste.",
            },
            { text: "" },
            {
              text: "Depedendo do tipo de equipamento desejado para o material, a ferramenta necessaria para sua forja será diferente. a CD e tempo necessário são determinados pela raridade. Esse tempo pode ser dividido iqualmente entre o número de pessoas que estão forjando, mas todos tem que passar no teste para ter sucesso",
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
              info={[
                {
                  text: "Quantifade é o número de vezes que uma unidade do material adquirido pode ser usado para tentar transformar em equipamento",
                },
                {
                  text: "Todos os usos sao consumidos em um sucesso",
                },
                {
                  text: "Múltiplas tentativas de forja podem ser feitas mesmo após sucesso. O sucesso só é mantido se todos forem sucesso e aí são múltiplos itens gerados pra a escolha de uma versão",
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
                { text: "Todos os itens não poções gerados são mágicos e precisam de sintonização" },
                {
                  text: "1 vez por descanso longo, pode re-sincronizar um item com cargas, tornando o total atual o resultado de 1d(x + total de habilidades) - total de habilidades, mínimo 0",
                },
                { text: "" },
                {
                  text: "Poções tem bônus de afixos dobrado, mas so duram até o final do próximo turno de quem a consumir. Poções com cargas, tem cargas usos.",
                },
                { text: "" },
                {
                  text: "Equipamentos lendários só podem ser criados como tesouro de criaturas lendárias e possuem ambos 5 afixos e habilidade bônus",
                },
                { text: "" },
                {
                  text: "Itens podem ser re-forjados pelo preço equivalente a sua raridade. Escolha um afixo para ser removido em troca de um bônus que varia com o tipo de equipamento ou um personalizado se feito por um mestre",
                },
                {
                  text: "Arma: Dano mínimo +2, mesmo ao errar. Armadura: Causa 2 de dano ao atacante se sofrer dano corpo a corpo. Acessório: +1 em teste de concentração e de resistência contra morte. Poção: Ganha +1 turno duração",
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
                  headers={["Preço / CD / Dias", "Forja de Item"]}
                  subHeaders={["Comprar", "Vender"]}
                  resultBackgroundColumn={true}
                  values={getItemCraftBuyPrices(materialPriceInflation).map((item, index) => ({
                    label: null,
                    top: item() + " PO / " + GetDCValue(creatureRarities[index].value, 10) + " / " + ITEMS_CRAFT_TIMES[index]() + " d",
                    bottom:
                      getItemCraftSellPrices()[index]() +
                      " PO / " +
                      GetDCValue(creatureRarities[index].value, 10) +
                      " / " +
                      ITEMS_CRAFT_TIMES[index]() +
                      " d",
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
                    <span className="label">Armaduras: </span>Ferramentas de ferreiro, ferramentas de costureiro, ferramentas de coureiro, ferramentas
                    de sapateiro
                  </span>
                  <span>
                    <span className="label">Acessórios: </span>Ferramentas de joalheiro
                  </span>
                  <span>
                    <span className="label">Poçoes: </span>Suprimentos de Alquimista
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
