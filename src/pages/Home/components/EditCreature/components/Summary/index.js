import React, { useState } from "react";
import * as utils from "../../../../../../utils";
import * as tc from "../../../../../../constants/treasureConstants";
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
            { title: "Raridade", value: cc.GetRarity(creature.rarity).display },
            { title: "Ambiente", value: cc.GetEnviromentDisplay(creature.environment).display },
            { title: "Tamanho", value: cc.GetSizeDisplay(creature.size).display },
            { title: "Tipo", value: cc.GetType(creature.type).display },
            { title: "Raça", value: cc.GetRace(creature.race)?.display },
            { title: "Classe", value: cc.GetClass(creature.class)?.display },
            { title: "Subclasse", value: cc.GetSubClass(creature.class, creature.subClass)?.display },
            { title: "Classe", value: cc.GetClass(creature.secondaryClass)?.display },
            { title: "Subclasse", value: cc.GetSubClass(creature.secondaryClass, creature.secondarySubClass)?.display },
          ],
        },
      ],
    },
    {
      boxes: [
        {
          header: "Deslocamentos",
          items: [
            { title: "Terrestre", value: cc.GetSpeed(creature.movements.speed)?.display },
            { title: "Vôo / Planar", value: cc.GetFlying(creature.movements.flying)?.display },
            { title: "Natação", value: cc.GetSwimming(creature.movements.swimming)?.display },
            { title: "Escavação / Escalada", value: cc.GetBurrowing(creature.movements.burrowing)?.display },
          ],
        },
        {
          header: "Tendências",
          items: [
            { title: "Primária", value: cc.GetPrimaryAlignment(creature.primaryAlignment).display },
            { title: "Secundária", value: cc.GetSecondaryAlignment(creature.secondaryAlignment).display },
          ],
        },
      ],
    },
    {
      boxes: [
        {
          header: "Atributos",
          items: [
            { title: "Força", value: cc.GetAttribute(creature.attributes.strength).display },
            { title: "Destreza", value: cc.GetAttribute(creature.attributes.dexterity).display },
            { title: "Constituiçao", value: cc.GetAttribute(creature.attributes.constitution).display },
            { title: "Inteligência", value: cc.GetAttribute(creature.attributes.intelligence).display },
            { title: "Sabedoria", value: cc.GetAttribute(creature.attributes.wisdom).display },
            { title: "Carisma", value: cc.GetAttribute(creature.attributes.charisma).display },
          ],
        },
      ],
    },
    {
      boxes: [
        {
          header: "Valores Básicos",
          items: [
            { title: "Vida (PV)", value: cc.GetHitPoints(creature.hitPoints).display },
            { title: "Ataque", value: cc.GetAttackBonus(creature.attack).display },
            { title: "CA", value: cc.GetArmorClass(creature.armorClass).display },
            { title: "Iniciativa", value: cc.GetInitiative(creature.initiative).display },
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
                value: types.map((de) => cc.GetDamageType(de.type).display).join(", "),
              };
            }),
        },
        {
          header: "Imune a Condições",
          items: [{ title: null, value: creature.conditionImmunities.map((ci) => cc.GetCondition(ci).display).join(", ") }].filter(
            (item) => item.value !== ""
          ),
        },
      ],
    },
    {
      boxes: [
        {
          header: "Idiomas",
          items: [{ title: null, value: creature.languages.map((l) => cc.GetLanguage(l)?.display).join(", ") }].filter((item) => item.value !== ""),
        },
        {
          header: "Sentidos",
          items: [
            { title: "Visao no Escuro", value: cc.GetSense(creature.senses.darkVision)?.display },
            { title: "Sentido Sísmico", value: cc.GetSense(creature.senses.tremorsense)?.display },
            { title: "Visao Cega", value: cc.GetSense(creature.senses.blindSight)?.display },
            { title: "Visao Verdadeira", value: cc.GetSense(creature.senses.trueSight)?.display },
          ].filter((item) => item.value),
        },
      ],
    },
    {
      boxes: [
        {
          header: "Especiais",
          items: [
            { title: "Resistência Lendária", value: cc.GetLegendaryResistency(creature.legendaryResistences)?.display },
            { title: "Regeneraçao (intensidade)", value: cc.GetRegenerationAmount(creature.regeneration.amount)?.display },
            ...creature.customSpecials.map((cs) => ({
              title: cs.description,
              value: cc.GetCustomSpecialMultiplier(cs.multiplier)?.display ?? "Nenhum",
            })),
          ],
        },
      ],
    },
    {
      boxes: [
        {
          header: "Açoes",
          items: creature.actions.map((a) => ({ title: a.name, value: cc.GetActionFrequency(a.frequency).display })),
        },
      ],
    },
    {
      boxes: [
        {
          header: "Reaçoes",
          items: creature.reactions.map((a) => ({ title: a.name, value: cc.GetActionFrequency(a.frequency).display })),
        },
        {
          header: "Aura",
          items: creature.aura ? [{ title: creature.aura.name, value: cc.GetAuraReach(creature.aura.reach).display }] : [],
        },
      ],
    },
    {
      boxes: [
        {
          header: "Tesouros",
          items: creature.treasures.map((t) => ({ title: t.name, value: tc.GetTreasureType(t.type).display })),
        },
      ],
    },
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
