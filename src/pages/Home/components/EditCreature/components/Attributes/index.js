import React, { useState, useMemo } from "react";

import {
  creatureAttributes,
  creatureHitPoints,
  creatureAttacks,
  CREATURE_ATTACK_VARIANCE,
  creatureArmorClasses,
  creatureInitiatives,
} from "../../../../../../constants/creatureConstants";
import * as ch from "../../../../../../helpers/creatureHelper";

import CheckInput from "../../../../../../components/CheckInput";
import Select from "../../../../../../components/Select";
import TextInput from "../../../../../../components/TextInput";

import "./styles.css";

function Attributes({ creature, setCreature }) {
  const [hasWeakSpots, setHasWeakSpots] = useState(creature.weakSpots.length > 0);
  const creatureHPUpdated = useMemo(
    () =>
      creatureHitPoints.map((a) => {
        let hp = ch.GetHPValue(ch.GetAverageLevel(creature.rarity), a.value, creature.attributes.constitution);

        return { ...a, display: `${a.display} (~${hp})` };
      }),
    [creature.attributes.constitution, creature.rarity]
  );
  const creatureAttacksUpdated = useMemo(
    () =>
      creatureAttacks.map((a) => {
        let attackValue = ch.GetAttackBonusValue(a.value, ch.GetAverageLevel(creature.rarity));

        return { ...a, display: `${a.display} +(${attackValue - CREATURE_ATTACK_VARIANCE}-${attackValue + CREATURE_ATTACK_VARIANCE})` };
      }),
    [creature.rarity]
  );

  const numberOfWeakSpots = 4;

  function HandleToggleWeakSpots() {
    creature.weakSpots = [];

    setHasWeakSpots(!hasWeakSpots);
  }

  function HandleWeakSpotChange(value, index) {
    if (value.weakSpots[index] === "") {
      value.weakSpots.splice(index, 1);
    }

    setCreature(value);
  }

  return (
    <div className="Attributes-container">
      <h2>Atributos</h2>
      <div className="basic-attributes">
        <Select
          label={"Força"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="attributes.strength"
          onSelect={setCreature}
          options={creatureAttributes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
          className="basic-attributes-item"
        />
        <Select
          label={"Destreza"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="attributes.dexterity"
          onSelect={setCreature}
          options={creatureAttributes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
          className="basic-attributes-item"
        />
        <Select
          label={"Constituição"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="attributes.constitution"
          onSelect={setCreature}
          options={creatureAttributes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
          className="basic-attributes-item"
        />
      </div>
      <div className="basic-attributes">
        <Select
          label={"Inteligência"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="attributes.intelligence"
          onSelect={setCreature}
          options={creatureAttributes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
          className="basic-attributes-item"
        />
        <Select
          label={"Sabedoria"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="attributes.wisdom"
          onSelect={setCreature}
          options={creatureAttributes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
          className="basic-attributes-item"
        />
        <Select
          label={"Carisma"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="attributes.charisma"
          onSelect={setCreature}
          options={creatureAttributes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
          className="basic-attributes-item"
        />
      </div>

      <h2>Valores Básicos</h2>
      <div className="basic-attributes">
        <Select
          label={"Vida (PV)"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="hitPoints"
          onSelect={setCreature}
          options={creatureHPUpdated}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Ataque"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="attack"
          onSelect={setCreature}
          options={creatureAttacksUpdated}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"CA"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="armorClass"
          onSelect={setCreature}
          options={creatureArmorClasses}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Iniciativa"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="initiative"
          onSelect={setCreature}
          options={creatureInitiatives}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
      </div>
      <CheckInput
        label="Pontos Fracos"
        info={[
          { text: "Algo que pode ser quebrado ou destruído, como: Perna, causa, asa, armadura" },
          { text: "Recomendado apenas para criaturas grandes ou maiores" },
          { text: "Esses pontos podem ser descritos pelo mestre, encontrados com testes, ou pela intuiçao dos personagens" },
          { text: "" },
          {
            text: "Pontos Fracos naturalmente possuem Meia Cobertura, pois a criatura o protege com o resto do corpo ou ele se encontra em difícil acesso. Isso por ser ignorado dependendo do posicionamento dos personagens",
          },
          {
            text: "Se alvo de um efeito com CD, um Ponto Fraco não pode ser protegido por Resistência Lendária, mas apenas ele e não a criatura como um todo é afetado pelo efeito da falha",
          },
        ]}
        onClick={HandleToggleWeakSpots}
        isSelected={hasWeakSpots}
      />
      {hasWeakSpots && (
        <div className="weak-spots">
          {Array.from(Array(numberOfWeakSpots)).map((ws, index) => (
            <TextInput
              key={index}
              label={`Ponto fraco`}
              value={creature}
              valuePropertyPath={`weakSpots[${index}]`}
              onChange={(value) => HandleWeakSpotChange(value, index)}
              className="creature-weak-spot"
              maxLength="14"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Attributes;
