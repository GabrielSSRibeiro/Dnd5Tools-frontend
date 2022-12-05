import React, { useState } from "react";

import Button from "../../../../../../../../components/Button";
import TextInput from "../../../../../../../../components/TextInput";
import CheckInput from "../../../../../../../../components/CheckInput";
import Select from "../../../../../../../../components/Select";
import Modal from "../../../../../../../../components/Modal";

import "./styles.css";

function ModalManageReaction({ reaction, onClose }) {
  const [tempReaction, setTempReaction] = useState(
    reaction ?? {
      name: null,
      description: null,
      type: null,
      typeDescription: null,
      trigger: null,
      triggerDescription: null,
      reach: null,
      frequency: null,
      intensity: null,
      damageType: null,
      condition: null,
      conditionDuration: null,
      difficultyClass: null,
      associatedWeakSpot: null,
      isSpell: null,
    }
  );

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempReaction);
  }

  return (
    <div className="ModalManageReaction-container">
      <Modal title="Reação" className="modal-action">
        <div className="new-action-wrapper">
          <section className="action-row">
            <TextInput label="Nome" />
            <Select label={"Tipo"} extraWidth={100} isLarge={true} />
            <TextInput label="Descrição (Tipo)" />
          </section>
          <section className="action-row">
            <TextInput label="Descrição (Opcional)" isMultiLine={true} />
            <aside>
              <section className="action-row">
                <Select label={"Gatilho"} extraWidth={100} isLarge={true} />
                <TextInput label="Descrição (Gatilho)" />
              </section>
              <section className="action-row">
                <Select label={"Alcance"} extraWidth={100} isLarge={true} />
                <Select label={"Frequência"} info={[{ text: "" }]} extraWidth={100} isLarge={true} />
              </section>
            </aside>
          </section>
          <section className="action-row">
            <Select label={"Intensidade (Opcional)"} extraWidth={100} isLarge={true} />
            <Select label={"Tipo de Dano"} extraWidth={100} isLarge={true} />
            <Select label={"Condição (Opcional)"} extraWidth={100} isLarge={true} />
            <Select label={"Duração"} extraWidth={100} isLarge={true} />
            <Select label={"Dificuldade"} extraWidth={100} isLarge={true} />
          </section>
          <footer>
            <Select label={"Ponto Fraco associado"} extraWidth={100} isLarge={true} nothingSelected="Nenhum" />
            <CheckInput
              label="Magia"
              info={[
                { text: "Efeitos relacionados a magias afetam essa ação" },
                { text: "Magias não podem ser selecionadas como efeito para possível recompensa" },
              ]}
            />
            <span>Ação com poder X/X</span>
            <div>
              <button className="button-simple" onClick={HandleCancel}>
                Cancelar
              </button>
              <Button text="Adicionar" onClick={HandleConfirm} />
            </div>
          </footer>
        </div>
      </Modal>
    </div>
  );
}

export default ModalManageReaction;
