import React from "react";

import {
  creatureRarities,
  CREATURE_ENVIROMENTS,
  CREATURE_SIZES,
  CREATURE_TYPES,
  HUMANOID_CREATURE_TYPE,
  CREATURE_RACES,
  CREATURE_CLASSES,
  DEFAULT_CREATURE_CLASS,
  DEFAULT_CREATURE_SUBCLASS,
  CREATURE_PRIMARY_ALIGNMENT,
  CREATURE_SECONDARY_ALIGNMENT,
  CREATURE_SPEED_MOVEMENTS,
  CREATURE_FLYING_MOVEMENTS,
  CREATURE_SWIMMING_MOVEMENTS,
  CREATURE_BURROWING_MOVEMENTS,
} from "../../../../../../data/creatureConstants";

import CheckInput from "../../../../../../components/CheckInput";
import Select from "../../../../../../components/Select";
import SelectButton from "../../../../../../components/SelectButton";

import "./styles.css";

function Definition({ creature, setCreature }) {
  const creatureClasses = [DEFAULT_CREATURE_CLASS].concat(CREATURE_CLASSES.map((c) => c.name));
  function getSubClasses(selectedClass) {
    let foundClass = CREATURE_CLASSES.find((c) => c.name === selectedClass);
    return [DEFAULT_CREATURE_SUBCLASS].concat(foundClass ? foundClass.subClasses : []);
  }

  function HandleSelectClass(creature) {
    creature.subClass = DEFAULT_CREATURE_SUBCLASS;

    setCreature(creature);
  }

  function HandleSelectSubClass(creature) {
    creature.secondarySubClass = DEFAULT_CREATURE_SUBCLASS;

    setCreature(creature);
  }

  function HandleToggleMulticlass() {
    setCreature({
      ...creature,
      multiclassing: !creature.multiclassing,
      secondaryClass: DEFAULT_CREATURE_CLASS,
      secondarySubClass: DEFAULT_CREATURE_SUBCLASS,
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
          options={CREATURE_ENVIROMENTS}
        />
        <Select
          label={"Tamanho"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="size"
          displayProperty={creature.size}
          onSelect={setCreature}
          options={CREATURE_SIZES}
        />
        <Select
          label={"Tipo"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="type"
          displayProperty={creature.type}
          onSelect={setCreature}
          options={CREATURE_TYPES}
        />
      </div>

      {creature.type === HUMANOID_CREATURE_TYPE && (
        <>
          <div className="extra-definitions">
            <Select
              label={"Raça"}
              extraWidth={100}
              value={creature}
              valuePropertyPath="race"
              displayProperty={creature.race}
              onSelect={setCreature}
              options={CREATURE_RACES}
            />
            <Select
              label={"Classe"}
              extraWidth={100}
              value={creature}
              valuePropertyPath="class"
              displayProperty={creature.class}
              onSelect={HandleSelectClass}
              options={creatureClasses}
            />
            <Select
              label={"Subclasse"}
              extraWidth={250}
              value={creature}
              valuePropertyPath="subClass"
              displayProperty={creature.subClass}
              onSelect={setCreature}
              options={getSubClasses(creature.class)}
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
              options={creatureClasses.filter((c) => c !== creature.class)}
              className={creature.multiclassing ? "" : "invisible"}
            />
            <Select
              label={"Segunda Subclasse"}
              extraWidth={250}
              value={creature}
              valuePropertyPath="secondarySubClass"
              displayProperty={creature.secondarySubClass}
              onSelect={setCreature}
              options={getSubClasses(creature.secondaryClass)}
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
          options={CREATURE_SPEED_MOVEMENTS}
        />
        <Select
          label={"Vôo / Planar"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="movement.flying"
          displayProperty={creature.movement.flying}
          onSelect={setCreature}
          options={CREATURE_FLYING_MOVEMENTS}
        />
        <Select
          label={"Natação"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="movement.swimming"
          displayProperty={creature.movement.swimming}
          onSelect={setCreature}
          options={CREATURE_SWIMMING_MOVEMENTS}
        />
        <Select
          label={"Escavação / Escalada"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="movement.burrowing"
          displayProperty={creature.movement.burrowing}
          onSelect={setCreature}
          options={CREATURE_BURROWING_MOVEMENTS}
        />
      </div>

      <h2>Tendências</h2>
      <div className="alignment">
        <aside>
          {CREATURE_PRIMARY_ALIGNMENT.map((option) => (
            <SelectButton
              key={option}
              isSelected={creature.primaryAlignment === option}
              text={option}
              onClick={() => setCreature({ ...creature, primaryAlignment: option })}
            />
          ))}
        </aside>
        <aside>
          {CREATURE_SECONDARY_ALIGNMENT.map((option) => (
            <SelectButton
              key={option}
              isSelected={creature.secondaryAlignment === option}
              text={option}
              onClick={() => setCreature({ ...creature, secondaryAlignment: option })}
            />
          ))}
        </aside>
      </div>
    </div>
  );
}

export default Definition;
