import React, { useState, useMemo } from "react";
//  import api from "../../services/api";

import {
  DEFAULT_CREATURE_RACE,
  DEFAULT_CREATURE_CLASS,
  DEFAULT_CREATURE_SUBCLASS,
  DEFAULT_CREATURE_SPEED,
  DEFAULT_CREATURE_MOVEMENT,
  DEFAULT_CREATURE_PRIMARY_ALIGNMENT,
  DEFAULT_CREATURE_SECONDARY_ALIGNMENT,
} from "../../../helpers/bestiaryHelper";

import Definition from "../EditCreature/Definition";
import Atributes from "../EditCreature/Atributes";
import Resistencies from "../EditCreature/Resistencies";
import Passives from "../EditCreature/Passives";
import Actions from "../EditCreature/Actions";
import TreasureReward from "../EditCreature/TreasureReward";
import Summary from "../EditCreature/Summary";
import Button from "../../Button";
import TextInput from "../../TextInput";

import "./styles.css";

function EditCreature({ setIsEditCreatureOpen }) {
  const [creature, setCreature] = useState({
    name: "Hidra Alada", //null,
    description: null,
    image: "https://i.pinimg.com/564x/01/d4/17/01d417c02bd190a056c718650fc9db3b.jpg", //null
    rarity: null,
    environment: null,
    size: null,
    type: null,
    race: DEFAULT_CREATURE_RACE,
    class: DEFAULT_CREATURE_CLASS,
    subClass: DEFAULT_CREATURE_SUBCLASS,
    multiclassing: false,
    secondaryClass: DEFAULT_CREATURE_CLASS,
    secondarySubClass: DEFAULT_CREATURE_SUBCLASS,
    movement: {
      speed: DEFAULT_CREATURE_SPEED,
      flying: DEFAULT_CREATURE_MOVEMENT,
      swimming: DEFAULT_CREATURE_MOVEMENT,
      burrowing: DEFAULT_CREATURE_MOVEMENT,
    },
    primaryAlignment: DEFAULT_CREATURE_PRIMARY_ALIGNMENT,
    secondaryAlignment: DEFAULT_CREATURE_SECONDARY_ALIGNMENT,
  });

  const progessBarSteps = useMemo(() => {
    function AreAllPreviousStepsValid() {
      return progessBarSteps.every((s) => s.isValid);
    }

    function IsDefinitionStepValid() {
      let areBasicsValid = [creature.name, creature.image].every((i) => i !== null);

      return areBasicsValid;
    }
    let progessBarSteps = [{ name: "Definiçao", isValid: IsDefinitionStepValid() }];

    function IsAtributesStepValid() {
      let areBasicsDefinitionsValid = [creature.rarity, creature.environment, creature.size, creature.type].every((i) => i !== null);
      let areMovimentsValid = [creature.movement.speed, creature.movement.flying, creature.movement.swimming, creature.movement.burrowing].some(
        (i) => i !== DEFAULT_CREATURE_MOVEMENT
      );

      return AreAllPreviousStepsValid() && areBasicsDefinitionsValid && areMovimentsValid;
    }
    progessBarSteps.push({ name: "Atributos", isValid: IsAtributesStepValid() });

    function IsResistenciesStepValid() {
      let itemsToValidate = [].every((i) => i !== null);

      return AreAllPreviousStepsValid() && itemsToValidate;
    }
    progessBarSteps.push({ name: "Resistências", isValid: IsResistenciesStepValid() });

    function IsPassivesStepValid() {
      let itemsToValidate = [].every((i) => i !== null);

      return AreAllPreviousStepsValid() && itemsToValidate;
    }
    progessBarSteps.push({ name: "Passivas", isValid: IsPassivesStepValid() });

    function IsActionsStepValid() {
      let itemsToValidate = [].every((i) => i !== null);

      return AreAllPreviousStepsValid() && itemsToValidate;
    }
    progessBarSteps.push({ name: "Açoes", isValid: IsActionsStepValid() });

    function IsTreasureRewardStepValid() {
      let itemsToValidate = [].every((i) => i !== null);

      return AreAllPreviousStepsValid() && itemsToValidate;
    }
    progessBarSteps.push({ name: "Tesouro", isValid: IsTreasureRewardStepValid() });

    function IsSummaryStepValid() {
      return AreAllPreviousStepsValid();
    }
    progessBarSteps.push({ name: "Sumário", isValid: IsSummaryStepValid() });

    return progessBarSteps;
  }, [creature]);

  const [isFirstStep, setIsFirstStep] = useState(!!!creature.type);
  const [imgUrl, setImgUrl] = useState(creature.image ?? "");
  const [tempCreatureAvatar, setTempCreatureAvatar] = useState(creature.image);
  const [isImgValid, setIsImgValid] = useState(!!creature.image ? true : null);
  const [activeProgessBarStep, setActiveProgessBarStep] = useState(progessBarSteps[0].name);

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
            <TextInput
              label="Nome"
              className="creature-name"
              value={creature}
              propertyPath="name"
              displayProperty={creature.name}
              onChange={setCreature}
            />
            <TextInput
              isMultiLine={true}
              label="Descrição (opcional)"
              className="creature-description"
              value={creature}
              propertyPath="description"
              displayProperty={creature.description}
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
          {activeProgessBarStep === "Definiçao" && <Definition creature={creature} setCreature={setCreature} />}
          {activeProgessBarStep === "Atributos" && <Atributes creature={creature} setCreature={setCreature} />}
          {activeProgessBarStep === "Resistências" && <Resistencies creature={creature} setCreature={setCreature} />}
          {activeProgessBarStep === "Passivas" && <Passives creature={creature} setCreature={setCreature} />}
          {activeProgessBarStep === "Açoes" && <Actions creature={creature} setCreature={setCreature} />}
          {activeProgessBarStep === "Tesouro" && <TreasureReward creature={creature} setCreature={setCreature} />}
          {activeProgessBarStep === "Sumário" && <Summary creature={creature} setCreature={setCreature} />}
        </main>
      </div>
    </div>
  );
}

export default EditCreature;
