import React, { useState, useEffect, useMemo, useRef } from "react";
import * as utils from "../../../../utils";
import { DEFAULT_AVATAR_POSITION, DEFAULT_AVATAR_SCALE, CREATURE_ACTION_FREQUENCIES } from "../../../../constants/creatureConstants";
import { IsBasicPack } from "../.../../../../../helpers/creatureHelper";

import ModalTextArea from "../../../../components/ModalTextArea";
import ModalFastBuild from "./ModalFastBuild";
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

function EditCreature({ creatureToEdit, HandleSave, HandleDelete, FinishEditing }) {
  const [creature, setCreature] = useState(creatureToEdit);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [modal, setModal] = useState(null);

  const avatarFirstStepProportion = useRef(450);
  const avatarEditProportion = useRef(300);
  let inputRef = useRef(null);
  const progessBarSteps = useMemo(() => {
    function AreAllPreviousStepsValid() {
      return progessBarSteps.every((s) => s.isValid);
    }

    function IsDefinitionStepValid() {
      let areBasicsValid = true; //[creature.name, creature.image].every((i) => i !== null);

      return areBasicsValid;
    }
    let progessBarSteps = [{ name: "Definiçao", isValid: IsDefinitionStepValid() }];

    function IsAtributesStepValid() {
      let areBasicsDefinitionsValid = [creature.rarity, creature.size, creature.type].every((i) => i !== null);
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
    progessBarSteps.push({ name: "Resistências", isValid: IsResistenciesStepValid() });

    function IsPassivesStepValid() {
      return AreAllPreviousStepsValid();
    }
    progessBarSteps.push({ name: "Passivas", isValid: IsPassivesStepValid() });

    function IsActionsStepValid() {
      return AreAllPreviousStepsValid();
    }
    progessBarSteps.push({ name: "Açoes", isValid: IsActionsStepValid() });

    function IsTreasureRewardStepValid() {
      let areActionsValid = creature.actions.some((a) => a.frequency === CREATURE_ACTION_FREQUENCIES.COMMON);

      return AreAllPreviousStepsValid() && areActionsValid;
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
  const [activeProgessBarStep, setActiveProgessBarStep] = useState(
    utils
      .clone(progessBarSteps)
      .reverse()
      .find((s) => s.isValid).name
  );

  const avatarProportion = useMemo(() => (isFirstStep ? avatarFirstStepProportion.current : avatarEditProportion.current), [isFirstStep]);
  const isBasicPack = useMemo(() => IsBasicPack(creature.owner), [creature.owner]);

  function UpdateAvatar() {
    if (imgUrl === null) {
      setImgUrl(tempCreatureAvatar);
    } else {
      if (isImgValid === false && creature.image) {
        setTempCreatureAvatar(creature.image);
      } else if (imgUrl === tempCreatureAvatar && imgUrl === creature.image) {
        setImgUrl(null);
        setIsImgValid(true);

        creature.imageX = null;
        creature.imageY = null;
        creature.imageScale = null;
        setCreature({ ...creature });
      } else {
        setTempCreatureAvatar(imgUrl);
      }
    }
  }

  const handleMouseDown = (e) => {
    setDragging(true);
    console.log("AAAAA");
    const offsetX = e.clientX - (creature.imageX != null ? creature.imageX * avatarProportion : DEFAULT_AVATAR_POSITION);
    const offsetY = e.clientY - (creature.imageY != null ? creature.imageY * avatarProportion : DEFAULT_AVATAR_POSITION);
    setOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const x = e.clientX - offset.x;
      const y = e.clientY - offset.y;

      creature.imageX = x / avatarProportion;
      creature.imageY = y / avatarProportion;
      setCreature({ ...creature });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleWheel = (e) => {
    const delta = e.deltaY > 0 ? -0.01 : 0.01; // Adjust the zoom speed as needed
    const newScale = (creature.imageScale != null ? creature.imageScale : DEFAULT_AVATAR_SCALE) + delta;
    // if (newScale >= 0.5 && newScale <= 2) {
    creature.imageScale = newScale;
    setCreature({ ...creature });
    // }
  };

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

  async function OpenModalDescription() {
    setModal(<ModalTextArea title="Descrição" text={creature.description} onClose={HandleCloseModalTextArea} />);
  }
  function HandleCloseModalTextArea(tempDescription) {
    if (tempDescription != null) {
      creature.description = tempDescription;
      setCreature({ ...creature });
    }

    setModal(null);
  }

  async function OpenModalFastBuild() {
    setModal(<ModalFastBuild creature={creature} onClose={HandleCloseModalFastBuild} />);
  }
  function HandleCloseModalFastBuild(tempCreature) {
    if (tempCreature != null) {
      HandleSave(tempCreature);
    }

    setModal(null);
  }

  function HandleStepClick(step) {
    setActiveProgessBarStep(step);
  }

  function ImportAscendance(event) {
    let file = event.target.files[0];

    if (file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        let uploadedCreature = JSON.parse(e.target.result);
        setCreature(uploadedCreature);
        setTempCreatureAvatar(uploadedCreature.image);
        setImgUrl(null);
        setIsImgValid(true);
        setIsFirstStep(false);
        setActiveProgessBarStep("Sumário");
      };
      reader.readAsText(file);
    }
  }

  useEffect(() => {
    if (!isBasicPack) {
      localStorage.setItem("creatureToEdit", JSON.stringify(creature));
    }
  }, [isBasicPack, creature, activeProgessBarStep]);

  return (
    <div className={`EditCreature-container ${!isFirstStep ? "main-edit-process" : ""}`}>
      {modal}
      <button className="button-simple end-editing" onClick={FinishEditing}>
        Cancelar
      </button>
      <div className={`first-step-wrapper ${!isFirstStep ? "edit-process-basic" : ""}`}>
        <div className="header-wrapper">
          <h2>{creatureToEdit.owner ? "Editar" : "Criar"} Criatura</h2>
          {!isBasicPack && (
            <button onClick={() => inputRef.current.click()} className="creature-import">
              <i className="fas fa-download import"></i>
              <input type="file" onChange={ImportAscendance} ref={inputRef} hidden={true} accept="application/JSON" />
            </button>
          )}
        </div>
        <main>
          <aside className="creature-avatar" style={{ width: avatarProportion, height: avatarProportion }}>
            {tempCreatureAvatar ? (
              <>
                <img
                  draggable="false"
                  src={tempCreatureAvatar}
                  alt="creature-avatar"
                  className={`${isImgValid === false ? "invisible" : ""}`}
                  onLoad={HandleImgOnLoad}
                  onError={HandleImgOnError}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onWheel={handleWheel}
                  onMouseLeave={() => setDragging(false)}
                  style={{
                    width: avatarProportion,
                    height: avatarProportion,
                    left: creature.imageX != null ? creature.imageX * avatarProportion : DEFAULT_AVATAR_POSITION,
                    top: creature.imageY != null ? creature.imageY * avatarProportion : DEFAULT_AVATAR_POSITION,
                    transform: `scale(${creature.imageScale != null ? creature.imageScale : DEFAULT_AVATAR_SCALE})`,
                    transformOrigin: "top left",
                    cursor: dragging ? "grabbing" : "grab",
                  }}
                />
                <i className={`fas fa-exclamation-triangle ${isImgValid ? "hidden" : ""}`}></i>
              </>
            ) : (
              <i className="fas fa-user-circle"></i>
            )}
            <div className="update-avatar-wrapper">
              <TextInput
                label="URL da Imagem"
                info={[
                  { text: "Copie o endereço de image imagem na web e o cole aqui para utilizar a imagem" },
                  { text: "" },
                  { text: "Lembre de manter o uso de imagens registradas para fins não comerciais" },
                ]}
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
            <TextInput label="Nome" className="creature-name" value={creature} valuePropertyPath="name" onChange={setCreature} maxLength="26" />
            <div className="description-wrapper">
              <button className="description-blocker" onClick={OpenModalDescription}>
                <i className="fas fa-pencil-alt edit"></i>
              </button>
              <TextInput
                isMultiLine={true}
                label="Descrição (opcional)"
                className="creature-description"
                value={creature}
                valuePropertyPath="description"
                onChange={setCreature}
              />
            </div>
          </aside>
        </main>
        {isFirstStep && (
          <div className="first-step-options">
            <Button text="Continuar" onClick={() => setIsFirstStep(false)} isDisabled={!creature.image || !creature.name} />
            <Button text="Criação Rápida" onClick={OpenModalFastBuild} isDisabled={!creature.image || !creature.name} />
          </div>
        )}
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
                  <div
                    className={`${
                      progessBarSteps[index].isValid && progessBarSteps[index + 1] && !progessBarSteps[index + 1].isValid ? " next-step" : ""
                    }`}
                  ></div>
                </aside>
              </section>
              <section>
                <div className="step-description" onClick={() => (activeProgessBarStep !== step.name ? HandleStepClick(step.name) : {})}>
                  <span>{step.name}</span>
                </div>
                <aside className="step-arrow">
                  <div onClick={() => (activeProgessBarStep !== step.name ? HandleStepClick(step.name) : {})}></div>
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
          {activeProgessBarStep === "Sumário" && (
            <Summary
              creature={creature}
              onSave={() => HandleSave(creature)}
              onDelete={creatureToEdit.owner ? () => HandleDelete(creature) : null}
              isBasicPack={isBasicPack}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default EditCreature;
