import React, { useState, useRef } from "react";

import Modal from "../../../../../../components/Modal";
import Button from "../../../../../../components/Button";
import TextInput from "../../../../../../components/TextInput";

import "./styles.css";

function ModalSuggestions({ notes, onClose }) {
  const [tempNotes, setTempNotes] = useState(notes);
  const suggestions = useRef([
    "Escolha uma criatura e defina quem ela é/são",
    "Em que tipo de terreno ela/elas moram ou por que elas moram nesse terreno? Localização vantajosa? Riquezas/recursos abundantes? Clima ideal?",
    "Como a presença dela/delas afeta a localização? Ela/elas tem um covil?",
    "Que outras criaturas estão presentes por ali e como ela/elas as afetam ou é/são afetadas por ela/elas?",
    "O que os habitantes dessa localização vivem de? O que fazem no tempo livre? Eles tem algum governo/tradição/religião ou funções individuais?",
    "Como é possível interagir com eles e por que? Quais os rumores da localização?",
    "Como os detalhes especiais do mundo afetam essa localização?",
    "Como essa localização é conhecida? Uma localização tem que ter uma justificativa para ter o nome que tem",
    "Como essa localização afeta as localizações próximas e que tipo de terreno elas são?",
    "Continuar exercício até que essa localização e as próximas tenham 4-12 tipos de criaturas",
  ]);

  return (
    <Modal title={"Sugestões de Criação"} className="ModalSuggestions-container df" onClickToClose={onClose}>
      <main className="content df df-fd-c df-jf-sb df-rg-10">
        <div className="df df-cg-10 df-f1">
          <aside className="suggestions df df-fd-c df-ai-fs df-jc-sb">
            {suggestions.current.map((message, index) => (
              <span key={index}>
                {index + 1}. <span>{message}</span>
              </span>
            ))}
          </aside>
          <aside className="notes df-f1">
            <TextInput
              placeholder="Responda essas perguntas separadamente antes de começar..."
              value={tempNotes}
              onChange={setTempNotes}
              isMultiLine={true}
              className="description"
            />
          </aside>
        </div>
      </main>
      <div className="divider"></div>
      <footer className="df">
        <button title="Limpar" className="button-simple" onClick={() => setTempNotes(null)}>
          <i className="fas fa-trash"></i>
        </button>
        <Button text="Fechar" onClick={() => onClose(tempNotes)} />
      </footer>
    </Modal>
  );
}

export default ModalSuggestions;
