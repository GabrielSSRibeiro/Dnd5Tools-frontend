import React, { useState } from "react";

import {
  creatureAttributes,
  creatureHitPoints,
  creatureAttacks,
  creatureArmorClass,
  creatureInitiatives,
} from "../../../../../../constants/creatureConstants";

import CheckInput from "../../../../../../components/CheckInput";
import Select from "../../../../../../components/Select";
import TextInput from "../../../../../../components/TextInput";

import "./styles.css";

function Attributes({ creature, setCreature }) {
  const [hasWeakSpots, setHasWeakSpots] = useState(creature.weakSpots.length > 0);

  const numberOfWeakSpots = 4;

  function HandleToggleWeakSpots() {
    creature.weakSpots = [];

    setHasWeakSpots(!hasWeakSpots);
  }

  function HandleWeakSpotChange(value, index) {
    if (value.weakSpots[index] === "") {
      value.weakSpots[index] = null;
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
          options={creatureHitPoints}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Ataque"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="attack"
          onSelect={setCreature}
          options={creatureAttacks}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"CA"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="armorClass"
          onSelect={setCreature}
          options={creatureArmorClass}
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
        info={[{ text: "Recomendado apenas para criaturas grandes ou maiores" }]}
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
              maxlength="14"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Attributes;
