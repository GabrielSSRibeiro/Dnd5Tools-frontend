import React, { useState } from "react";

import * as utils from "../../../../../../../../utils";
import {
  TREASURE_TYPES,
  treasureTypes,
  GOLD_PIECES_QUANTITIES,
  goldPiecesQuantities,
  materialQuantities,
  materialWeigths,
  // equipmentAttributes,
  equipmentTypes,
} from "../../../../../../../../constants/treasureConstants";
import {
  CREATURE_RARITIES,
  creatureRarities,
  // damageTypes,
  CREATURE_ACTION_FREQUENCIES,
  creatureActionFrequencies,
} from "../../../../../../../../constants/creatureConstants";

import Button from "../../../../../../../../components/Button";
import TextInput from "../../../../../../../../components/TextInput";
import Select from "../../../../../../../../components/Select";
import Modal from "../../../../../../../../components/Modal";

import "./styles.css";

function ModalManageTreasure({ treasure, creatureRarity, creatureActions, invalidNames, onClose }) {
  const [tempTreasure, setTempTreasure] = useState(
    treasure
      ? utils.clone(treasure)
      : {
          name: null,
          description: null,
          type: TREASURE_TYPES.GOLD_PIECES,
          frequency: CREATURE_ACTION_FREQUENCIES.COMMON,
          goldPieces: {
            quantity: GOLD_PIECES_QUANTITIES.FEW,
          },
          material: {
            rarity: null,
            quantity: null,
            weight: null,
          },
          equipment: {
            type: null,
            rarity: null,
            damageType: null,
            attribute: null,
            ability: null,
          },
        }
  );

  function HandleSelectType(updatedValue) {
    const clearMaterial = () => {
      tempTreasure.material.rarity = null;
      tempTreasure.material.quantity = null;
      tempTreasure.material.weight = null;
    };
    const clearEquipment = () => {
      tempTreasure.equipment.type = null;
      tempTreasure.equipment.rarity = null;
      tempTreasure.equipment.damageType = null;
      tempTreasure.equipment.attribute = null;
      tempTreasure.equipment.ability = null;
    };

    if (updatedValue.type === TREASURE_TYPES.GOLD_PIECES) {
      clearMaterial();
      clearEquipment();
    } else if (updatedValue.type === TREASURE_TYPES.MATERIAL) {
      tempTreasure.goldPieces.quantity = null;

      tempTreasure.material.rarity = creatureRarity;
      clearEquipment();
    } else if (updatedValue.type === TREASURE_TYPES.EQUIPMENT) {
      tempTreasure.equipment.ability = null;

      tempTreasure.goldPieces.quantity = null;
      clearMaterial();
    }

    setTempTreasure(updatedValue);
  }

  function HandleSelectEquipmentRarity(updatedValue) {
    tempTreasure.equipment.damageType = null;
    tempTreasure.equipment.attribute = null;

    setTempTreasure(updatedValue);
  }

  function HandleSelectAbility(updatedValue) {
    if (tempTreasure.equipment.rarity !== CREATURE_RARITIES.LEGENDARY) {
      tempTreasure.equipment.damageType = null;
      tempTreasure.equipment.attribute = null;
    }

    setTempTreasure(updatedValue);
  }

  function IsModalValid() {
    if (!tempTreasure.name || invalidNames.includes(tempTreasure.name) || !tempTreasure.frequency) {
      return false;
    }

    if (tempTreasure.type === TREASURE_TYPES.GOLD_PIECES) {
      return tempTreasure.goldPieces.quantity;
    } else if (tempTreasure.type === TREASURE_TYPES.MATERIAL) {
      return tempTreasure.material.quantity && tempTreasure.material.weight;
    } else if (tempTreasure.type === TREASURE_TYPES.EQUIPMENT) {
      if (!tempTreasure.equipment.type || !tempTreasure.equipment.rarity) {
        return false;
      }

      if (tempTreasure.equipment.rarity !== CREATURE_RARITIES.LEGENDARY) {
        return (tempTreasure.equipment.attribute && tempTreasure.equipment.attribute) || tempTreasure.equipment.ability;
      } else {
        return tempTreasure.equipment.attribute && tempTreasure.equipment.attribute && tempTreasure.equipment.ability;
      }
    }
  }

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempTreasure);
  }

  return (
    <div className="ModalManageTreasure-container">
      <Modal title="Tesouro" className="modal-action">
        <div className="new-action-wrapper">
          <section className="action-row">
            <TextInput label="Nome" value={tempTreasure} valuePropertyPath="name" onChange={setTempTreasure} className="longer-input" />
            <Select
              label={"Tipo"}
              info={[
                {
                  text: "Material pode ser usado para forja de equipamentos ou para recuperar habilidade perdida de equipamento. Na Forja, primeiro se dedica o tempo e depois se faz o teste. Para identificar a raridade de um material, é recomendado um teste de dificuldade média(natureza ou outro)",
                },
                { text: "" },
                {
                  text: "Depedendo do tipo de equipamento desejado para o material, a ferramenta necessaria para sua forja será diferente. a CD e tempo necessário são determinados pela raridade da criatura. Um dia de forja é o equivalente a 8 horas, o limite diárío sem exaustão, e pode ser dividido iqualmente entre o número de pessoas que estão forjando, mas todos tem que passar no teste para ter sucesso",
                },
              ]}
              className="treasure-type"
              extraWidth={100}
              isLarge={true}
              value={tempTreasure}
              valuePropertyPath="type"
              onSelect={HandleSelectType}
              options={treasureTypes}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            {tempTreasure.type === TREASURE_TYPES.GOLD_PIECES && (
              <Select
                label={"Quantidade"}
                extraWidth={100}
                isLarge={true}
                value={tempTreasure}
                valuePropertyPath="goldPieces.quantity"
                onSelect={setTempTreasure}
                options={goldPiecesQuantities}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
            )}
            {tempTreasure.type === TREASURE_TYPES.MATERIAL && (
              <Select
                label={"Raridade"}
                info={[{ text: "Referente a raridade da criatura" }]}
                extraWidth={100}
                isLarge={true}
                value={tempTreasure}
                valuePropertyPath="material.rarity"
                onSelect={setTempTreasure}
                options={creatureRarities}
                optionDisplay={(o) => o.treasureDisplay}
                optionValue={(o) => o.value}
              />
            )}
            {tempTreasure.type === TREASURE_TYPES.EQUIPMENT && (
              <Select
                label={"Raridade"}
                info={[
                  {
                    text: "Equipamentos lendários só podem ser criados como tesouro de criaturas lendárias",
                  },
                ]}
                extraWidth={100}
                isLarge={true}
                value={tempTreasure}
                valuePropertyPath="equipment.rarity"
                onSelect={HandleSelectEquipmentRarity}
                options={
                  creatureRarity === CREATURE_RARITIES.LEGENDARY
                    ? creatureRarities
                    : creatureRarities.filter((r) => r.value !== CREATURE_RARITIES.LEGENDARY)
                }
                optionDisplay={(o) => o.treasureDisplay}
                optionValue={(o) => o.value}
              />
            )}
            <Select
              label={"Frequência"}
              extraWidth={100}
              isLarge={true}
              value={tempTreasure}
              valuePropertyPath="frequency"
              onSelect={setTempTreasure}
              options={creatureActionFrequencies}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
          </section>
          <section className="action-row">
            <TextInput
              label="Descrição (Opcional)"
              info={[{ text: "Recomendado apenas para texto descritivo e não mecânicas extras" }]}
              isMultiLine={true}
              value={tempTreasure}
              valuePropertyPath="description"
              onChange={setTempTreasure}
              className="longer-input"
            />
            {tempTreasure.type === TREASURE_TYPES.MATERIAL && (
              <aside>
                <section className="action-row">
                  <Select
                    label={"Quantidade"}
                    info={[{ text: "Número de vezes que uma unidade desse material pode ser usado para tentar transformar em equipamento" }]}
                    extraWidth={100}
                    isLarge={true}
                    value={tempTreasure}
                    valuePropertyPath="material.quantity"
                    onSelect={setTempTreasure}
                    options={materialQuantities}
                    optionDisplay={(o) => o.display}
                    optionValue={(o) => o.value}
                  />
                  <Select
                    label={"Peso"}
                    extraWidth={100}
                    isLarge={true}
                    value={tempTreasure}
                    valuePropertyPath="material.weight"
                    onSelect={setTempTreasure}
                    options={materialWeigths}
                    optionDisplay={(o) => o.display}
                    optionValue={(o) => o.value}
                  />
                </section>
              </aside>
            )}
            {tempTreasure.type === TREASURE_TYPES.EQUIPMENT && (
              <aside>
                <section className="action-row">
                  <Select
                    label={"Tipo do Equipamento"}
                    info={[
                      { text: "Todos os itens gerados são mágicos e precisam de sincronização" },
                      {
                        text: "1 vez por descanso longo, pode re-sincronizar um item com cargas, tornando o total atual o resultado de 1d(x + total de habilidades) - total de habilidades, onde x é total de cargas do item, mínimo 0",
                      },
                    ]}
                    extraWidth={100}
                    isLarge={true}
                    value={tempTreasure}
                    valuePropertyPath="equipment.type"
                    onSelect={setTempTreasure}
                    options={equipmentTypes}
                    optionDisplay={(o) => o.display}
                    optionValue={(o) => o.value}
                  />
                  <Select
                    label={"Habilidade"}
                    className="equipment-ability"
                    info={[
                      {
                        text: "Transforme uma das ações não comuns da criatura em uma habilidade com número de usos diários de acordo com a frequência",
                      },
                      { text: "" },
                      {
                        text: "Essa habilidade também pode ser usada uma vez adicional, fazendo a habilidade não ser mais recuperada diariamente. É apenas possível recuperar uma habilidade usada assim através de forja com uma material da mesma raridade do equipamento",
                      },
                      { text: "" },
                      {
                        text: "Itens com cargas podem ser combinados com outro item com cargas. Preço e tempo sao os mesmos de forja para a raridade. O novo total de cargas é igual ao maior dos dois menos o total de cargas máximas já consumidas do item base. O item apromorado ganha a habilidade de carga do segundo item, o destruindo. A proporção do uso de cargas é mantida",
                      },
                      {
                        text: "Ex: Item 1 tem 2 cargas e habilidade consome 1. Item 2 tem 4 cargas e habilidade consome 1. O item aprimorado terá 4 cargas com a habilidade original que consome 1 e a nova que agora consome 2",
                      },
                    ]}
                    extraWidth={100}
                    isLarge={true}
                    value={tempTreasure}
                    valuePropertyPath="equipment.ability"
                    onSelect={HandleSelectAbility}
                    options={creatureActions}
                    nothingSelected="Nenhuma"
                    optionDisplay={(o) => o.name}
                    optionValue={(o) => o.name}
                  />
                </section>
                {/* {(!tempTreasure.equipment.ability || tempTreasure.equipment.rarity === CREATURE_RARITIES.LEGENDARY) && (
                  <section className="action-row">
                    <Select
                      label={"Tipo de Possível Dano"}
                      extraWidth={100}
                      isLarge={true}
                      value={tempTreasure}
                      valuePropertyPath="equipment.damageType"
                      onSelect={setTempTreasure}
                      options={damageTypes}
                      optionDisplay={(o) => o.display}
                      optionValue={(o) => o.value}
                    />
                    <Select
                      label={"Atributo de Possível Bônus"}
                      extraWidth={100}
                      isLarge={true}
                      value={tempTreasure}
                      valuePropertyPath="equipment.attribute"
                      onSelect={setTempTreasure}
                      options={equipmentAttributes}
                      optionDisplay={(o) => o.display}
                      optionValue={(o) => o.value}
                    />
                  </section>
                )} */}
              </aside>
            )}
          </section>
          <footer>
            <div className="extra-details">
              <div></div>
              <aside>
                <button className="button-simple" onClick={HandleCancel}>
                  Cancelar
                </button>
                <Button text="Salvar" onClick={HandleConfirm} isDisabled={!IsModalValid()} />
              </aside>
            </div>
          </footer>
        </div>
      </Modal>
    </div>
  );
}

export default ModalManageTreasure;
