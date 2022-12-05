import React, { useState } from "react";
import * as utils from "../../../../../../utils";
import {
  languages,
  creatureSenseReaches,
  creatureLegendaryResistences,
  creatureRegenerations,
  damageTypes,
  creatureCustomSpecialMultipliers,
} from "../../../../../../data/creatureConstants";

import CheckInput from "../../../../../../components/CheckInput";
import Select from "../../../../../../components/Select";
import TextInput from "../../../../../../components/TextInput";

import "./styles.css";

function Passives({ creature, setCreature }) {
  const [hasDarkVision, setHasDarkVision] = useState(!!creature.senses.darkVision);
  const [hasTremorsense, setHasTremorsense] = useState(!!creature.senses.tremorsense);
  const [hasBlindSight, setHasBlindSight] = useState(!!creature.senses.blindSight);
  const [hasTrueSight, setHasTrueSight] = useState(!!creature.senses.trueSight);
  const [hasLegendaryResistences, setHasLegendaryResistences] = useState(!!creature.legendaryResistences);
  const [hasRegeneration, setHasRegeneration] = useState(!!creature.regeneration.amount);
  const [hasCustomSpecials, setHasCustomSpecials] = useState(creature.customSpecials.some((cs) => cs.description));

  const numberOfCustomSpecials = 3;
  const customSpecialsArray = utils.createArrayFromInt(numberOfCustomSpecials);

  function setCreatureLanguages(value) {
    let language = creature.languages.find((l) => l === value);
    if (language) {
      creature.languages = creature.languages.filter((l) => l !== value);
    } else {
      creature.languages.push(value);
    }

    setCreature({ ...creature });
  }

  function HandleToggleLegendaryResistences() {
    if (hasLegendaryResistences) {
      creature.legendaryResistences = null;

      setCreature(creature);
    }
    setHasLegendaryResistences(!hasLegendaryResistences);
  }

  function HandleToggleRegeneration() {
    if (hasRegeneration) {
      creature.regeneration.amount = null;
      creature.regeneration.breakDamage = null;

      setCreature(creature);
    }

    setHasRegeneration(!hasRegeneration);
  }

  function HandleToggleCustomSpecials() {
    creature.customSpecials = customSpecialsArray.map((cs) => ({ description: null, multiplier: null }));
    setCreature(creature);

    setHasCustomSpecials(!hasCustomSpecials);
  }

  function HandleCustomSpecialChange(value, index) {
    if (value.customSpecials[index].description === "") {
      value.customSpecials[index] = { description: null, multiplier: null };
    }

    setCreature(value);
  }

  return (
    <div className="Passives-container">
      <div className="languages">
        <h2>Idiomas</h2>
        <div className="languages-wrapper">
          {languages.map((l) => (
            <>
              <div className="languages-options">
                <CheckInput
                  key={l.value}
                  label={l.display}
                  onClick={() => setCreatureLanguages(l.value)}
                  isSelected={creature.languages.find((ci) => ci === l.value)}
                />
              </div>
              {/* <div className="languages-divider"></div> */}
            </>
          ))}
        </div>
      </div>
      <div className="senses">
        <h2>Sentidos</h2>
        <div className="senses-wrapper">
          <CheckInput label="Visão no Escuro" onClick={() => setHasDarkVision(!hasDarkVision)} isSelected={hasDarkVision} />
          {hasDarkVision && (
            <Select
              label={"Alcance"}
              extraWidth={100}
              value={creature}
              valuePropertyPath="senses.darkVision"
              onSelect={setCreature}
              options={creatureSenseReaches}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
          )}
          <div className="senses-divider"></div>
          <CheckInput label="Sentido Sísmico" onClick={() => setHasTremorsense(!hasTremorsense)} isSelected={hasTremorsense} />
          {hasTremorsense && (
            <Select
              label={"Alcance"}
              extraWidth={100}
              value={creature}
              valuePropertyPath="senses.tremorsense"
              onSelect={setCreature}
              options={creatureSenseReaches}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
          )}
          <div className="senses-divider"></div>
          <CheckInput label="Visão Cega" onClick={() => setHasBlindSight(!hasBlindSight)} isSelected={hasBlindSight} />
          {hasBlindSight && (
            <Select
              label={"Alcance"}
              extraWidth={100}
              value={creature}
              valuePropertyPath="senses.blindSight"
              onSelect={setCreature}
              options={creatureSenseReaches}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
          )}
          <div className="senses-divider"></div>
          <CheckInput label="Visão Verdadeira" onClick={() => setHasTrueSight(!hasTrueSight)} isSelected={hasTrueSight} />
          {hasTrueSight && (
            <Select
              label={"Alcance"}
              extraWidth={100}
              value={creature}
              valuePropertyPath="senses.blindSight"
              onSelect={setCreature}
              options={creatureSenseReaches}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
          )}
        </div>
      </div>
      <div className="specials">
        <h2>Especiais</h2>
        <div className="specials-wrapper">
          <div className="specials-row">
            <CheckInput
              label="Resistência Lendária"
              onClick={HandleToggleLegendaryResistences}
              isSelected={hasLegendaryResistences}
              className="specials-row-item"
            />
            <CheckInput
              label="Regeneração"
              info={[{ text: "Recupera PV no começo do turno" }, { text: "Pode ser desativada por 1 turno ao sobrer o tipo de dano selecionado" }]}
              onClick={HandleToggleRegeneration}
              isSelected={hasRegeneration}
              className="specials-row-item"
            />
          </div>
          {(hasLegendaryResistences || hasRegeneration) && (
            <div className="specials-row">
              <Select
                label={"Intensidade"}
                extraWidth={100}
                value={creature}
                valuePropertyPath="legendaryResistences"
                onSelect={setCreature}
                options={creatureLegendaryResistences}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                className={hasLegendaryResistences ? "" : "invisible"}
              />
              <Select
                label={"Intensidade"}
                extraWidth={100}
                value={creature}
                valuePropertyPath="regeneration.amount"
                onSelect={setCreature}
                options={creatureRegenerations}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                className={hasRegeneration ? "" : "invisible"}
              />
              <Select
                label={"Quebra"}
                extraWidth={100}
                optionsAtATime={10}
                value={creature}
                valuePropertyPath="regeneration.breakDamage"
                onSelect={setCreature}
                options={damageTypes}
                nothingSelected="Nenhuma"
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                className={hasRegeneration ? "" : "invisible"}
                isDisabled={!creature.regeneration.amount}
              />
            </div>
          )}
          <div className="specials-divider"></div>
          <CheckInput
            label="Personalizado"
            info={[
              { text: "Opções simples como sobrevoo, anfíbio e natureza anormal" },
              { text: "Ou habilidades poderosas que multiplicam o poder final da criatura" },
            ]}
            onClick={HandleToggleCustomSpecials}
            isSelected={hasCustomSpecials}
          />
          {hasCustomSpecials &&
            customSpecialsArray.map((os, index) => (
              <div className="specials-row" key={index}>
                <TextInput
                  label={`Descrição`}
                  value={creature}
                  valuePropertyPath={`customSpecials[${index}].description`}
                  onChange={(value) => HandleCustomSpecialChange(value, index)}
                  className="creature-custom-specials"
                  maxlength="40"
                />
                <Select
                  label={"Multiplicador"}
                  optionsAtATime={3}
                  extraWidth={100}
                  value={creature}
                  valuePropertyPath={`customSpecials[${index}].multiplier`}
                  onSelect={setCreature}
                  options={creatureCustomSpecialMultipliers}
                  nothingSelected="Nenhum"
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                  isDisabled={!creature.customSpecials[index].description}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Passives;
