import React, { useState, useRef } from "react";
import * as utils from "../../../../../../utils";
import { creatureEnvironments, CREATURE_ENVIRONMENTS, creatureTypes } from "../../../../../../constants/creatureConstants";

import Modal from "../../../../../../components/Modal";
import Button from "../../../../../../components/Button";
import TextInput from "../../../../../../components/TextInput";
import SelectButton from "../../../../../../components/SelectButton";

import "./styles.css";

function ModalSuggestions({ notes, onClose }) {
  const ideaSuggestion = useRef("Ideas");
  const mapSuggestion = useRef("Mapa");
  const dungeonSuggestion = useRef("Masmorra");
  const suggestionModes = useRef([ideaSuggestion.current, mapSuggestion.current, dungeonSuggestion.current]);

  const ideaSuggestions = useRef([
    "Escolha uma criatura, quem ela é e qual seu nome e alcunha?",
    "Em que tipo de terreno (planície, montanha) ela mora e por que ela mora nesse terreno? Seria localização vantajosa? Riquezas/recursos abundantes? Clima ideal?",
    "Como a presença dela afeta a localização? Ela tem um covil? Qual o nome dele?",
    "Que outras criaturas estão presentes por ali e como ela as afeta ou é afetada por elas?",
    "O que os habitantes dessa localização vivem de? O que fazem no tempo livre? Eles tem algum governo/tradição/religião ou funções individuais?",
    "Como é possível interagir com eles e por que? Quais os rumores da localização?",
    "Como os detalhes especiais do mundo(politica, cultura, guerra, magia) afetam essa localização?",
    "Como essa localização é conhecida? Uma localização tem que ter uma justificativa para ter o nome que tem",
    "Como essa localização afeta as localizações próximas e que tipo de terreno (planície, montanha) elas são?",
    "Continuar exercício até que essa localização e as próximas tenham 4-12 criaturas diferentes",
  ]);
  const mapSuggestions = useRef([
    "Quando começando em um mar ou área aberta, tente criar primeiro, de forma simples, uma localização que engloba tudo que terá ali dentro, como por exemplo um continente ou planície",
    "Quando criando uma localização, que tem outras dentro dela, tente criar localizações de tipos de terreno diferentes",
    "Quando terminar de criar uma localização, prepare uma marcha com ritmo normal, nenhuma montaria e peso medio. A duracao recomendada de uma marcha direta entre marcos importantes sob essas condiçoes é de aproximadamente 8 horas",
    "Quando colocar pontos em uma localização, sempre ter algum marco ou mudança de terreno com distância pequena. Sempre coloque rios, ravias e montanhas entre os marcos",
  ]);
  const dungeonSuggestions = useRef([
    "As salas serem boas é o segredo. Os encontros tem distância pra dar tempo de fazer estratégias e raramente vai ser de fato próximo e sem jeito",
    "Propósito da masmorra? Toda masmorra deve ter um tema que representa ela toda e seus perigos básicos",
    "Quais os habitantes? Como as criaturas interagem umas com as outras? Existem Sub regiões na masmorra? A entrada de cada sub região, incluindo a entrada principal, pode ser bloqueada com alguma lógica que se repete pela masmorra e impede a passagem fácil ou a modifica",
    "Defina uma disposição. Arrudeios e caminhos alternativos podem ser interessantes e as vezes secretos",
    "Rastros e mensagens em salas",
    "Proporçao de 1/3 criaturas, 1/3 vazios, 1/3 tesouros e armadilhas",
  ]);
  const [suggestionMode, setSuggestionMode] = useState(ideaSuggestion.current);
  const [tempNotes, setTempNotes] = useState(notes);
  const [randomType, setRandomType] = useState(null);

  function HandleSuggestionModeChange(mode) {
    setRandomType(null);
    setSuggestionMode(mode);
  }

  return (
    <Modal title={"Proposta de Criação"} className="ModalSuggestions-container df" onClickToClose={onClose}>
      <main className="content df df-fd-c df-jf-sb df-rg-10">
        {suggestionMode === ideaSuggestion.current ? (
          <div className="df df-cg-10 df-f1">
            <aside className="ideia-suggestions df df-fd-c df-ai-fs df-jc-sb">
              {ideaSuggestions.current.map((message, index) => (
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
        ) : (
          <aside className="map-suggestions df df-fd-c df-jc-fs df-ai-fs df-rg-20">
            {(suggestionMode === mapSuggestion.current ? mapSuggestions.current : dungeonSuggestions.current).map((message, index) => (
              <h3 key={index}>{message}</h3>
            ))}
          </aside>
        )}
      </main>
      <div className="divider"></div>
      <footer className="df">
        <aside className="suggestion-actions df df-cg-20">
          {suggestionMode === ideaSuggestion.current && (
            <button title="Limpar" className=" button-simple" onClick={() => setTempNotes(null)}>
              <i className="fas fa-trash"></i>
            </button>
          )}
          <button
            title="Aleatório"
            className=" button-simple"
            onClick={() =>
              setRandomType(
                utils.randomItemFromArray(
                  suggestionMode === ideaSuggestion.current
                    ? creatureTypes
                    : creatureEnvironments.filter((e) => e.value !== CREATURE_ENVIRONMENTS.ALL)
                ).display
              )
            }
          >
            <i className="fas fa-random"></i>
          </button>
          <span>{randomType}</span>
        </aside>
        <Button text="Fechar" onClick={() => onClose(tempNotes)} />
        <aside className="suggestion-modes df">
          {suggestionModes.current.map((m) => (
            <SelectButton isSelected={m === suggestionMode} text={m} onClick={() => HandleSuggestionModeChange(m)} key={m} />
          ))}
        </aside>
      </footer>
    </Modal>
  );
}

export default ModalSuggestions;
