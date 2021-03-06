import React, { useState, useMemo } from "react";
//  import api from "../../services/api";
import * as utils from "../../../../utils";
import {
  CREATURE_MOVEMENTS,
  CREATURE_PRIMARY_ALIGNMENTS,
  CREATURE_SECONDARY_ALIGNMENTS,
  CREATURE_HIT_POINTS,
  CREATURE_ATTACKS,
  CREATURE_ARMOR_CLASS,
  CREATURE_INITIATIVES,
  DAMAGES_EFFECTIVENESS,
  DAMAGE_TYPES,
  CONDITIONS,
} from "../../../../data/creatureConstants";

import Definition from "./components/Definition";
import Atributes from "./components/Attributes";
import Resistencies from "./components/Resistencies";
import Passives from "./components/Passives";
import Actions from "./components/Actions";
import TreasureReward from "./components/TreasureReward";
import Summary from "./components/Summary";
import Button from "../../../../components/Button";
import TextInput from "../../../../components/TextInput";

import "./styles.css";

function EditCreature({ creatureToEdit = null, setIsEditCreatureOpen }) {
  const newCreature = {
    name: null,
    description: null,
    image: null,
    rarity: null,
    environment: null,
    size: null,
    type: null,
    race: null,
    class: null,
    subClass: null,
    secondaryClass: null,
    secondarySubClass: null,
    movements: {
      speed: CREATURE_MOVEMENTS.MEDIUM,
      flying: null,
      swimming: null,
      burrowing: null,
    },
    primaryAlignment: CREATURE_PRIMARY_ALIGNMENTS.NEUTRAL,
    secondaryAlignment: CREATURE_SECONDARY_ALIGNMENTS.NEUTRAL,
    attributes: {
      strength: null,
      dexterity: null,
      constitution: null,
      intelligence: null,
      wisdom: null,
      charisma: null,
    },
    hitPoints: CREATURE_HIT_POINTS.MEDIUM,
    attack: CREATURE_ATTACKS.MEDIUM,
    armorClass: CREATURE_ARMOR_CLASS.MEDIUM,
    initiative: CREATURE_INITIATIVES.MEDIUM,
    weakSpots: [],
    damagesEffectiveness: [
      { type: DAMAGE_TYPES.SLASHING, value: DAMAGES_EFFECTIVENESS.NORMAL },
      { type: DAMAGE_TYPES.PIERCING, value: DAMAGES_EFFECTIVENESS.NORMAL },
      { type: DAMAGE_TYPES.BLUDGEONING, value: DAMAGES_EFFECTIVENESS.NORMAL },
      { type: DAMAGE_TYPES.ACID, value: DAMAGES_EFFECTIVENESS.NORMAL },
      { type: DAMAGE_TYPES.COLD, value: DAMAGES_EFFECTIVENESS.NORMAL },
      { type: DAMAGE_TYPES.FIRE, value: DAMAGES_EFFECTIVENESS.NORMAL },
      { type: DAMAGE_TYPES.FORCE, value: DAMAGES_EFFECTIVENESS.NORMAL },
      { type: DAMAGE_TYPES.LIGHTNING, value: DAMAGES_EFFECTIVENESS.NORMAL },
      { type: DAMAGE_TYPES.NECROTIC, value: DAMAGES_EFFECTIVENESS.NORMAL },
      { type: DAMAGE_TYPES.POISON, value: DAMAGES_EFFECTIVENESS.NORMAL },
      { type: DAMAGE_TYPES.PSYCHIC, value: DAMAGES_EFFECTIVENESS.NORMAL },
      { type: DAMAGE_TYPES.RADIANT, value: DAMAGES_EFFECTIVENESS.NORMAL },
      { type: DAMAGE_TYPES.THUNDER, value: DAMAGES_EFFECTIVENESS.NORMAL },
    ],
    conditionImmunities: [
      { type: CONDITIONS.GRAPPLED, value: false },
      { type: CONDITIONS.PRONE, value: false },
      { type: CONDITIONS.BLINDED, value: false },
      { type: CONDITIONS.RESTRAINED, value: false },
      { type: CONDITIONS.POISONED, value: false },
      { type: CONDITIONS.FRIGHTENED, value: false },
      { type: CONDITIONS.STUNNED, value: false },
      { type: CONDITIONS.PARALYZED, value: false },
      { type: CONDITIONS.PETRIFIED, value: false },
      { type: CONDITIONS.UNCONSCIOUS, value: false },
      { type: CONDITIONS.EXHAUSTION, value: false },
    ],
  };
  const [creature, setCreature] = useState(creatureToEdit ?? newCreature);

  const progessBarSteps = useMemo(() => {
    function AreAllPreviousStepsValid() {
      return progessBarSteps.every((s) => s.isValid);
    }

    function IsDefinitionStepValid() {
      let areBasicsValid = true; //[creature.name, creature.image].every((i) => i !== null);

      return areBasicsValid;
    }
    let progessBarSteps = [{ name: "Defini??ao", isValid: IsDefinitionStepValid() }];

    function IsAtributesStepValid() {
      let areBasicsDefinitionsValid = [creature.rarity, creature.environment, creature.size, creature.type].every((i) => i !== null);
      let areMovimentsValid = [creature.movements.speed, creature.movements.flying, creature.movements.swimming, creature.movements.burrowing].some(
        (i) => i !== null
      );

      return AreAllPreviousStepsValid() && areBasicsDefinitionsValid && areMovimentsValid;
    }
    progessBarSteps.push({ name: "Atributos", isValid: IsAtributesStepValid() });

    function IsResistenciesStepValid() {
      let areAttributesValid = [
        creature.attributes.strength,
        creature.attributes.dexterity,
        creature.attributes.constitution,
        creature.attributes.intelligence,
        creature.attributes.wisdom,
        creature.attributes.charisma,
      ].every((i) => i !== null);

      let actualWeakSpots = creature.weakSpots.filter((ws) => ws);
      let areWeakSpotsValid = new Set(actualWeakSpots).size === actualWeakSpots.length;

      return AreAllPreviousStepsValid() && areAttributesValid && areWeakSpotsValid;
    }
    progessBarSteps.push({ name: "Resist??ncias", isValid: IsResistenciesStepValid() });

    function IsPassivesStepValid() {
      return AreAllPreviousStepsValid();
    }
    progessBarSteps.push({ name: "Passivas", isValid: IsPassivesStepValid() });

    function IsActionsStepValid() {
      let itemsToValidate = [null].every((i) => i !== null);

      return AreAllPreviousStepsValid() && itemsToValidate;
    }
    progessBarSteps.push({ name: "A??oes", isValid: IsActionsStepValid() });

    function IsTreasureRewardStepValid() {
      let itemsToValidate = [null].every((i) => i !== null);

      return AreAllPreviousStepsValid() && itemsToValidate;
    }
    progessBarSteps.push({ name: "Tesouro", isValid: IsTreasureRewardStepValid() });

    function IsSummaryStepValid() {
      return AreAllPreviousStepsValid();
    }
    progessBarSteps.push({ name: "Sum??rio", isValid: IsSummaryStepValid() });

    return progessBarSteps;
  }, [creature]);

  const [isFirstStep, setIsFirstStep] = useState(!!!creature.type);
  const [imgUrl, setImgUrl] = useState(creature.image ?? "");
  const [tempCreatureAvatar, setTempCreatureAvatar] = useState(creature.image);
  const [isImgValid, setIsImgValid] = useState(!!creature.image ? true : null);
  const [activeProgessBarStep, setActiveProgessBarStep] = useState(
    utils
      .clone(progessBarSteps)
      .reverse()
      .find((s) => s.isValid).name
  );

  function HandleCancel() {
    setIsEditCreatureOpen(false);
  }

  function UpdateAvatar() {
    if (imgUrl === null) {
      setImgUrl(tempCreatureAvatar);
    } else {
      if (isImgValid === false && creature.image) {
        setTempCreatureAvatar(creature.image);
      } else if (imgUrl === tempCreatureAvatar && imgUrl === creature.image) {
        setImgUrl(null);
        setIsImgValid(true);
      } else {
        setTempCreatureAvatar(imgUrl);
      }
    }
  }

  function HandleImgUrlOnChange(value) {
    setIsImgValid(true);
    setImgUrl(value);
    setTempCreatureAvatar(null);
  }

  function HandleImgOnLoad() {
    if (imgUrl) {
      creature.image = tempCreatureAvatar;
      setIsImgValid(true);
      setImgUrl(null);
      setCreature({ ...creature });
    } else {
      setImgUrl(tempCreatureAvatar);
    }
  }

  function HandleImgOnError() {
    setIsImgValid(false);
  }

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  return (
    <div className={`EditCreature-container ${!isFirstStep ? "main-edit-process" : ""}`}>
      <button className="end-editing" onClick={HandleCancel}>
        Cancelar
      </button>
      <div className={`first-step-wrapper ${!isFirstStep ? "edit-process-basic" : ""}`}>
        <h2>Criar Criatura</h2>
        <main>
          <aside className="creature-avatar">
            {tempCreatureAvatar ? (
              <>
                <img
                  src={tempCreatureAvatar}
                  alt="creature-avatar"
                  className={`${isImgValid === false ? "invisible" : ""}`}
                  onLoad={HandleImgOnLoad}
                  onError={HandleImgOnError}
                />
                <i className={`fas fa-exclamation-triangle ${isImgValid ? "hidden" : ""}`}></i>
              </>
            ) : (
              <i className="fas fa-user-circle"></i>
            )}
            <div className="update-avatar-wrapper">
              <TextInput
                label="URL da Imagem"
                className={`img-url ${imgUrl === null ? "invisible" : ""}`}
                value={imgUrl}
                onChange={HandleImgUrlOnChange}
              />
              <Button
                icon={imgUrl === null ? "fas fa-pencil-alt" : isImgValid === false && creature.image ? "fas fa-times" : "fas fa-check"}
                className="update-button"
                onClick={UpdateAvatar}
                isDisabled={imgUrl === ""}
              />
            </div>
          </aside>
          <aside className="creature-details">
            <TextInput label="Nome" className="creature-name" value={creature} valuePropertyPath="name" onChange={setCreature} />
            <TextInput
              isMultiLine={true}
              label="Descri????o (opcional)"
              className="creature-description"
              value={creature}
              valuePropertyPath="description"
              onChange={setCreature}
            />
          </aside>
        </main>
        {isFirstStep && <Button text="Continuar" onClick={() => setIsFirstStep(false)} isDisabled={!creature.image || !creature.name} />}
      </div>
      <div className={`${isFirstStep ? "hidden" : "edit-process-details"}`}>
        <header className="progess-bar">
          {progessBarSteps.map((step, index) => (
            <div
              key={step.name}
              className={`progess-bar-step${activeProgessBarStep === step.name ? " selected-step" : ""}${!step.isValid ? " step-disabled" : ""}`}
              style={{ zIndex: -1 - index }}
            >
              <section className="step-border">
                <div className="step-description"></div>
                <aside className="step-arrow">
                  <div></div>
                </aside>
              </section>
              <section>
                <div className="step-description" onClick={() => (activeProgessBarStep !== step.name ? setActiveProgessBarStep(step.name) : {})}>
                  <span>{step.name}</span>
                </div>
                <aside className="step-arrow">
                  <div onClick={() => (activeProgessBarStep !== step.name ? setActiveProgessBarStep(step) : {})}></div>
                </aside>
              </section>
            </div>
          ))}
        </header>
        <main>
          {activeProgessBarStep === "Defini??ao" && <Definition creature={creature} setCreature={setCreature} />}
          {activeProgessBarStep === "Atributos" && <Atributes creature={creature} setCreature={setCreature} />}
          {activeProgessBarStep === "Resist??ncias" && <Resistencies creature={creature} setCreature={setCreature} />}
          {activeProgessBarStep === "Passivas" && <Passives creature={creature} setCreature={setCreature} />}
          {activeProgessBarStep === "A??oes" && <Actions creature={creature} setCreature={setCreature} />}
          {activeProgessBarStep === "Tesouro" && <TreasureReward creature={creature} setCreature={setCreature} />}
          {activeProgessBarStep === "Sum??rio" && <Summary creature={creature} setCreature={setCreature} />}
        </main>
      </div>
    </div>
  );
}

export default EditCreature;
