import React from "react";

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
} from "../../../../../../data/creatureConstants";

import CheckInput from "../../../../../../components/CheckInput";
import Select from "../../../../../../components/Select";
import SelectButton from "../../../../../../components/SelectButton";

import "./styles.css";

function Definition({ creature, setCreature }) {
  function getSubClasses(selectedClass) {
    let foundClass = creatureClasses.find((c) => c.value === selectedClass);
    return foundClass ? foundClass.subClasses : [];
  }

  function HandleSelectClass(creature) {
    creature.subClass = null;

    setCreature(creature);
  }

  function HandleSelectSubClass(creature) {
    creature.secondarySubClass = null;

    setCreature(creature);
  }

  function HandleToggleMulticlass() {
    setCreature({
      ...creature,
      multiclassing: !creature.multiclassing,
      secondaryClass: null,
      secondarySubClass: null,
    });
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
          extraWidth={100}
          value={creature}
          valuePropertyPath="environment"
          displayProperty={creature.environment}
          onSelect={setCreature}
          options={creatureEnvironments}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Tamanho"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="size"
          displayProperty={creature.size}
          onSelect={setCreature}
          options={creatureSizes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Tipo"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="type"
          displayProperty={creature.type}
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
              extraWidth={100}
              value={creature}
              valuePropertyPath="race"
              displayProperty={creature.race}
              onSelect={setCreature}
              nothingSelected="Nenhuma"
              options={creatureRaces}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Classe"}
              extraWidth={100}
              value={creature}
              valuePropertyPath="class"
              displayProperty={creature.class}
              onSelect={HandleSelectClass}
              nothingSelected="Nenhuma"
              options={creatureClasses}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Subclasse"}
              extraWidth={250}
              value={creature}
              valuePropertyPath="subClass"
              displayProperty={creature.subClass}
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
              <CheckInput label="Multiclasse" onClick={HandleToggleMulticlass} isSelected={creature.multiclassing} />
            </div>
            <Select
              label={"Segunda Classe"}
              extraWidth={100}
              value={creature}
              valuePropertyPath="secondaryClass"
              displayProperty={creature.secondaryClass}
              onSelect={HandleSelectSubClass}
              nothingSelected="Nenhuma"
              options={creatureClasses.filter((c) => c.value !== creature.class)}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              className={creature.multiclassing ? "" : "invisible"}
            />
            <Select
              label={"Segunda Subclasse"}
              extraWidth={250}
              value={creature}
              valuePropertyPath="secondarySubClass"
              displayProperty={creature.secondarySubClass}
              onSelect={setCreature}
              nothingSelected="Nenhuma"
              options={getSubClasses(creature.secondaryClass)}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
              className={creature.multiclassing ? "" : "invisible"}
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
          value={creature}
          valuePropertyPath="movement.speed"
          displayProperty={creature.movement.speed}
          onSelect={setCreature}
          nothingSelected="Nenhum"
          options={creatureSpeedMovements}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Vôo / Planar"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="movement.flying"
          displayProperty={creature.movement.flying}
          onSelect={setCreature}
          nothingSelected="Nenhum"
          options={creatureFlyingMovements}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Natação"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="movement.swimming"
          displayProperty={creature.movement.swimming}
          onSelect={setCreature}
          nothingSelected="Nenhum"
          options={creatureSwimmingMovements}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Escavação / Escalada"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="movement.burrowing"
          displayProperty={creature.movement.burrowing}
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
