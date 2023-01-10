import React, { useState } from "react";
import * as utils from "../../../../../../utils";
import * as ch from "../../../../../../helpers/creatureHelper";
import * as cc from "../../../../../../constants/creatureConstants";

import Button from "../../../../../../components/Button";
import Info from "../../../../../../components/Info";
import ModalExport from "./components/ModalExport";
import ModalWarning from "../../../../../../components/ModalWarning";

import "./styles.css";

function Summary({ creature, onSave, onDelete, isBasicPack }) {
  const [isBusy, setIsBusy] = useState(false);
  const [modal, setModal] = useState(null);

  const summaryRows = [
    {
      boxes: [
        {
          header: "Definições Básicas",
          items: [
            { title: "Raridade", value: ch.GetRarityDisplay(creature.rarity) },
            { title: "Ambiente", value: ch.GetEnviromentDisplay(creature.environment) },
            { title: "Tamanho", value: ch.GetSizeDisplay(creature.size) },
            { title: "Tipo", value: ch.GetTypeDisplay(creature.type) },
            { title: "Classe", value: ch.GetClassDisplay(creature.class) },
            { title: "Subclasse", value: ch.GetSubClassDisplay(creature.class, creature.subClass) },
            { title: "Classe", value: ch.GetClassDisplay(creature.secondaryClass) },
            { title: "Subclasse", value: ch.GetSubClassDisplay(creature.secondaryClass, creature.secondarySubClass) },
          ],
        },
      ],
    },
    {
      boxes: [
        {
          header: "Deslocamentos",
          items: [
            { title: "Terrestre", value: ch.GetSpeedDisplay(creature.movements.speed) },
            { title: "Vôo / Planar", value: ch.GetFlyingDisplay(creature.movements.flying) },
            { title: "Natação", value: ch.GetSwimmingDisplay(creature.movements.swimming) },
            { title: "Escavação / Escalada", value: ch.GetBurrowingDisplay(creature.movements.burrowing) },
          ],
        },
        {
          header: "Tendências",
          items: [
            { title: "Primária", value: ch.GetPrimaryAlignmentDisplay(creature.primaryAlignment) },
            { title: "Secundária", value: ch.GetSecondaryAlignmentDisplay(creature.secondaryAlignment) },
          ],
        },
      ],
    },
    {
      boxes: [
        {
          header: "Atributos",
          items: [
            { title: "Força", value: ch.GetAttributeDisplay(creature.attributes.strength) },
            { title: "Destreza", value: ch.GetAttributeDisplay(creature.attributes.dexterity) },
            { title: "Constituiçao", value: ch.GetAttributeDisplay(creature.attributes.constitution) },
            { title: "Inteligência", value: ch.GetAttributeDisplay(creature.attributes.intelligence) },
            { title: "Sabedoria", value: ch.GetAttributeDisplay(creature.attributes.wisdom) },
            { title: "Carisma", value: ch.GetAttributeDisplay(creature.attributes.charisma) },
          ],
        },
      ],
    },
    {
      boxes: [
        {
          header: "Valores Básicos",
          items: [
            { title: "Vida (PV)", value: ch.GetHPDisplay(creature.hitPoints) },
            { title: "Ataque", value: ch.GetAttackBonusDisplay(creature.attack) },
            { title: "CA", value: ch.GetACDisplay(creature.armorClass) },
            { title: "Iniciativa", value: ch.GetInitiativeDisplay(creature.initiative) },
          ],
        },
        {
          header: "Pontos Fracos",
          items: creature.weakSpots.map((ws) => ({ title: null, value: ws })),
        },
      ],
    },
    {
      boxes: [
        {
          header: "Resistências e Vulnerabilidades",
          items: Object.entries(utils.GroupArrayBy(creature.damagesEffectiveness, "value"))
            .filter((item) => parseInt(item[0]) !== cc.DAMAGES_EFFECTIVENESS.NORMAL)
            .map((item) => {
              const value = parseInt(item[0]);
              const types = item[1];

              return {
                title: cc.damageTypes.find((dt) => dt.value === types[0].type).damageEffectiveness.find((de) => de.value === value).display,
                value: types.map((de) => ch.GetDamageTypeDisplay(de.type)).join(", "),
              };
            }),
        },
        {
          header: "Imune a Condições",
          items: [{ title: null, value: creature.conditionImmunities.map((ci) => ch.GetConditionDisplay(ci)).join(", ") }].filter(
            (item) => item.value !== ""
          ),
        },
      ],
    },
    // {
    //   boxes: [
    //     {
    //       header: "Idiomas",
    //       items: [],
    //     },
    //     {
    //       header: "Sentidos",
    //       items: [],
    //     },
    //   ],
    // },
  ];

  async function OpenModalExport() {
    setModal(<ModalExport creature={creature} onClose={setModal} />);
  }

  async function OpenDeleteConfirmation() {
    if (!isBasicPack) {
      setModal(
        <ModalWarning
          title="Deletar Criatura"
          message="Tem certeza que deseja deletar essa criatura?"
          cancelText="Cancelar"
          onCancel={setModal}
          confirmText="Deletar"
          onConfirm={HandleDeleteCreature}
        />
      );
    }
  }
  function HandleDeleteCreature() {
    onDelete();
    setModal();
  }

  async function HandleSaveCreature() {
    if (!isBasicPack) {
      setIsBusy(true);
      await onSave();
      setIsBusy(false);
    }
  }

  return (
    <div className="Summary-container">
      {modal}
      <div className="summary-header">
        <div className="details">
          <h2>Detalhes</h2>
          <Info
            contents={[
              {
                text: "Escalas de Poder ofensiva(vermelha) e defensiva(verde) representam o quao intensa a criatura é, em realação ao máximo e mínimo possível",
              },
            ]}
          />
        </div>
        <div className="power-scale-wrapper">
          <i className="fas fa-khanda power-scale-icon"></i>
          <aside className="power-scale-bar">
            <div className="power-scale-fill offensive"></div>
          </aside>
          <i className="fas fa-shield-alt power-scale-icon"></i>
          <aside className="power-scale-bar">
            <div className="power-scale-fill defensive"></div>
          </aside>
        </div>
        <div className="actions">
          <button onClick={OpenModalExport} className="creature-export">
            <i className="fas fa-upload"></i>
          </button>
          {onDelete && (
            <button className="button-simple" onClick={OpenDeleteConfirmation} disabled={isBasicPack}>
              Deletar
            </button>
          )}
          <Button text={isBusy ? "Salvando" : "Salvar"} onClick={HandleSaveCreature} isDisabled={isBusy || isBasicPack} className="creature-save" />
        </div>
      </div>
      <div className="summary-fields">
        {summaryRows.map((row, rowIndex) => (
          <div className="summary-row" key={rowIndex}>
            {row.boxes
              .filter((box) => box.items.length > 0)
              .map((box, boxIndex) => (
                <div className="summary-box" key={boxIndex}>
                  <header>
                    <h5>{box.header}</h5>
                  </header>
                  <main className="summary-items">
                    {box.items
                      .filter((item) => item.value)
                      .map((item, itemIndex) => (
                        <div className="summary-item" key={itemIndex}>
                          <span className="title">{item.title}</span>
                          <span>{item.value}</span>
                        </div>
                      ))}
                  </main>
                  <footer>{box.footer}</footer>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Summary;
