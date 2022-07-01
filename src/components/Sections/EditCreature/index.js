import React, { useState } from "react";
//  import api from "../../services/api";

import Button from "../../Button";
import TextInput from "../../TextInput";

import "./styles.css";

function EditCreature({ setIsEditCreatureOpen }) {
  const [imgUrl, setImgUrl] = useState("");
  const [creature, setCreature] = useState({
    name: null,
    description: null,
    image: "https://i.pinimg.com/564x/01/d4/17/01d417c02bd190a056c718650fc9db3b.jpg", //null
    levelRange: null,
    environment: null,
    type: null,
    size: null,
  });
  const [isFirstStep, setIsFirstStep] = useState(!!!creature.type);
  const [tempCreatureAvatar, setTempCreatureAvatar] = useState(creature.image);
  const [isImgValid, setIsImgValid] = useState(!!creature.image ? true : null);

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
    <div className="EditCreature-container">
      <button className="end-editing" onClick={HandleCancel}>
        Cancelar
      </button>
      {isFirstStep ? (
        <div className="first-step-wrapper">
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
          <Button text="Continuar" onClick={() => setIsFirstStep(false)} isDisabled={!creature.image || !creature.name} />
        </div>
      ) : (
        <div className="edit-process-wrapper">
          {/* check if img exists, mover fistStep pro lado(column, sizes and hide button) e fazer progress bar(nao eh comp) */}
        </div>
      )}
    </div>
  );
}

export default EditCreature;
