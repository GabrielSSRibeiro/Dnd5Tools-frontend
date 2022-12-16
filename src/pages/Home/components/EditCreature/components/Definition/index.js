import React, { useState } from "react";

import {
  creatureRarities,
  creatureEnvironments,
  creatureSizes,
  CREATURE_TYPES,
  creatureTypes,
  creatureRaces,
  creatureClasses,
  creaturePrimaryAlignments,
  creatureSecondaryAlignments,
  creatureSpeedMovements,
  creatureFlyingMovements,
  creatureSwimmingMovements,
  creatureBurrowingMovements,
} from "../../../../../../constants/creatureConstants";

import CheckInput from "../../../../../../components/CheckInput";
import Select from "../../../../../../components/Select";
import SelectButton from "../../../../../../components/SelectButton";

import "./styles.css";

function Definition({ creature, setCreature }) {
  const [isMulticlass, setIsMulticlass] = useState(!!creature.secondaryClass);

  function getSubClasses(selectedClass) {
    let foundClass = creatureClasses.find((c) => c.value === selectedClass);
    return foundClass ? foundClass.subClasses : [];
  }

  function HandleSelectClass(updatedCreature) {
    updatedCreature.subClass = null;
    if (!updatedCreature.class || updatedCreature.class === updatedCreature.secondaryClass) {
      HandleToggleMulticlass();
    }

    setCreature(updatedCreature);
  }

  function HandleSelectSecondaryClass(updatedCreature) {
    updatedCreature.secondarySubClass = null;

    setCreature(updatedCreature);
  }

  function HandleToggleMulticlass() {
    if (isMulticlass) {
      creature.secondaryClass = null;
      creature.secondarySubClass = null;

      setCreature(creature);
    }

    setIsMulticlass(!isMulticlass);
  }

  return (
    <div className="Definition-container">
      <h2>Definições Básicas</h2>
      <div className="basic-definitions">
        <Select
          label={"Raridade"}
          extraWidth={150}
          value={creature}
          valuePropertyPath="rarity"
          onSelect={setCreature}
          options={creatureRarities}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Ambiente"}
          optionsAtATime={11}
          extraWidth={100}
          value={creature}
          valuePropertyPath="environment"
          onSelect={setCreature}
          options={creatureEnvironments}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Tamanho"}
          optionsAtATime={6}
          extraWidth={100}
          value={creature}
          valuePropertyPath="size"
          onSelect={setCreature}
          options={creatureSizes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Tipo"}
          optionsAtATime={10}
          extraWidth={100}
          value={creature}
          valuePropertyPath="type"
          onSelect={setCreature}
          options={creatureTypes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
      </div>

      {creature.type === CREATURE_TYPES.HUMANOID && (
        <>
          <div className="extra-definitions">
            <Select
              label={"Raça"}
              extraWidth={150}
              optionsAtATime={7}
              value={creature}
              valuePropertyPath="race"
              onSelect={setCreature}
              nothingSelected="Nenhuma"
              options={creatureRaces}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Classe"}
              optionsAtATime={8}
              extraWidth={100}
              value={creature}
              valuePropertyPath="class"
              onSelect={HandleSelectClass}
              nothingSelected="Nenhuma"
              options={creatureClasses}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Subclasse"}
              extraWidth={250}
              optionsAtATime={7}
              value={creature}
              valuePropertyPath="subClass"
              onSelect={setCreature}
              nothingSelected="Nenhuma"
              options={getSubClasses(creature.class)}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              isDisabled={!creature.class}
            />
          </div>
          <div className="multiclassing">
            <div className="multiclassing-checkbox-wrapper">
              <CheckInput label="Multiclasse" onClick={HandleToggleMulticlass} isSelected={isMulticlass} isDisabled={!creature.class} />
            </div>
            <Select
              label={"Segunda Classe"}
              extraWidth={100}
              optionsAtATime={7}
              value={creature}
              valuePropertyPath="secondaryClass"
              onSelect={HandleSelectSecondaryClass}
              nothingSelected="Nenhuma"
              options={creatureClasses.filter((c) => c.value !== creature.class)}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              className={isMulticlass ? "" : "invisible"}
            />
            <Select
              label={"Segunda Subclasse"}
              extraWidth={250}
              optionsAtATime={7}
              value={creature}
              valuePropertyPath="secondarySubClass"
              onSelect={setCreature}
              nothingSelected="Nenhuma"
              options={getSubClasses(creature.secondaryClass)}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              className={isMulticlass ? "" : "invisible"}
              isDisabled={!creature.secondaryClass}
            />
          </div>
        </>
      )}

      <h2>Deslocamento</h2>
      <div className="movement">
        <Select
          label={"Terrestre"}
          extraWidth={100}
          optionsAtATime={4}
          value={creature}
          valuePropertyPath="movements.speed"
          onSelect={setCreature}
          nothingSelected="Nenhum"
          options={creatureSpeedMovements}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Vôo / Planar"}
          extraWidth={100}
          optionsAtATime={4}
          value={creature}
          valuePropertyPath="movements.flying"
          onSelect={setCreature}
          nothingSelected="Nenhum"
          options={creatureFlyingMovements}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Natação"}
          extraWidth={100}
          optionsAtATime={4}
          value={creature}
          valuePropertyPath="movements.swimming"
          onSelect={setCreature}
          nothingSelected="Nenhum"
          options={creatureSwimmingMovements}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Escavação / Escalada"}
          extraWidth={100}
          optionsAtATime={4}
          value={creature}
          valuePropertyPath="movements.burrowing"
          onSelect={setCreature}
          nothingSelected="Nenhum"
          options={creatureBurrowingMovements}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
      </div>

      <h2>Tendências</h2>
      <div className="alignment">
        <aside>
          {creaturePrimaryAlignments.map((option) => (
            <SelectButton
              key={option.value}
              isSelected={creature.primaryAlignment === option.value}
              text={option.display}
              onClick={() => setCreature({ ...creature, primaryAlignment: option.value })}
            />
          ))}
        </aside>
        <aside>
          {creatureSecondaryAlignments.map((option) => (
            <SelectButton
              key={option.value}
              isSelected={creature.secondaryAlignment === option.value}
              text={option.display}
              onClick={() => setCreature({ ...creature, secondaryAlignment: option.value })}
            />
          ))}
        </aside>
      </div>
    </div>
  );
}

export default Definition;
