import React, { useState } from "react";
//  import api from "../../services/api";

import Button from "../../Button";
import TextInput from "../../TextInput";

import "./styles.css";

function EditCreature({ setIsEditCreatureOpen }) {
  const [creature, setCreature] = useState({
    name: "Hidra Alada", //null,
    description: null,
    image: "https://i.pinimg.com/564x/01/d4/17/01d417c02bd190a056c718650fc9db3b.jpg", //null
    levelRange: null,
    environment: null,
    type: null,
    size: null,
  });
  const [isFirstStep, setIsFirstStep] = useState(!!!creature.type);
  const [imgUrl, setImgUrl] = useState(creature.image ?? "");
  const [tempCreatureAvatar, setTempCreatureAvatar] = useState(creature.image);
  const [isImgValid, setIsImgValid] = useState(!!creature.image ? true : null);
  const [activeProgessBarStep, setActiveProgessBarStep] = useState("Definição");

  const progessBarSteps = ["Definição", "Atributos", "Resistências", "Passivas", "Ações", "Tesouro", "Sumário"]; //effect/memo?

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
            <TextInput label="Nome" className="creature-name" value={creature} property="name" onChange={setCreature} />
            <TextInput
              isMultiLine={true}
              label="Descrição (opcional)"
              className="creature-description"
              value={creature}
              property="description"
              onChange={setCreature}
            />
          </aside>
        </main>
        {isFirstStep && <Button text="Continuar" onClick={() => setIsFirstStep(false)} isDisabled={!creature.image || !creature.name} />}
      </div>
      <div className={`${isFirstStep ? "hidden" : "edit-process-details"}`}>
        <header className="progess-bar">
          {progessBarSteps.map((step) => (
            <div className="progess-bar-step" onClick={() => setActiveProgessBarStep(step)}>
              <section className="step-border">
                <div className="step-description"></div>
                <aside className="step-arrow"></aside>
              </section>
              <section>
                <div className="step-description">
                  <span>{step}</span>
                </div>
                <aside className="step-arrow"></aside>
              </section>
            </div>
          ))}
        </header>
        <main>
          <div>{activeProgessBarStep}</div>
        </main>
      </div>
    </div>
  );
}

export default EditCreature;
