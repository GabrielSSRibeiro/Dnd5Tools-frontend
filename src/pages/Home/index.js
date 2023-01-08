import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/Auth";

import Panel from "../../components/Panel";
import NaviBar from "../../components/NaviBar";
import SkillCheck from "./components/SkillCheck";
import CombatSetup from "./components/CombatSetup";
import Combat from "./components/Combat";
import Treasure from "./components/Treasure";
import EditCreature from "./components/EditCreature";

import background from "../../assets/background.png";
import "./styles.css";

function Home() {
  const MAIN_TABS = {
    SKILL_CHECK: "Teste de Perícia",
    GENERAL: "Geral",
    COMBAT: "Combate",
    TREASURE: "Tesouro",
  };

  const [openTab, setOpenTab] = useState(MAIN_TABS.GENERAL);
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  const [isSelectingParty, setIsSelectingParty] = useState(false);
  const [isBestiaryOpen, setIsBestiaryOpen] = useState(false);
  const [isSelectingBestiary, setIsSelectingBestiary] = useState(false);
  const [isEditCreatureOpen, setIsEditCreatureOpen] = useState(false);
  const [creatureToEdit, setCreatureToEdit] = useState(null);
  const [level, setLevel] = useState(null);
  const [groups, setGroups] = useState([]);
  const [creatures, setCreatures] = useState(null);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [selectedCreatures, setSelectedCreatures] = useState([]);
  const [combats, setCombats] = useState([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    api.get("GetCreaturesByOwner", { params: { owner: currentUser.uid } }).then((response) => {
      setCreatures(response.data);
    });

    setLevel(1);
    // setGroups([
    //   ["Foux", "Isaac", "Zeth", "Adler", "Motonui", "Elros"],
    //   ["Soiaz", "Yaisyl"],
    // ]);
  }, [setCreatures, currentUser.uid]);

  function HandleSelectFromParty() {
    if (groups.length === 1) {
      setSelectedCharacters(...groups);
    } else {
      setIsSelectingParty(true);
      setIsPartyOpen(true);
    }
    setIsBestiaryOpen(false);
  }

  function HandleSelectFromBestiary() {
    setIsSelectingBestiary(true);
    setIsBestiaryOpen(true);
    setIsPartyOpen(false);
  }

  function HandleGenerateCombat() {
    const newCombatTab = combats.length + 1;
    setCombats([...combats, { selectedCharacters, selectedCreatures }]);
    setOpenTab(newCombatTab);
    setSelectedCharacters([]);
    setSelectedCreatures([]);
  }

  function HandleEndCombat() {
    const NewCombats = combats.filter((combat, index) => openTab !== index + 1);

    setCombats(NewCombats);
    setOpenTab(MAIN_TABS.COMBAT);
  }

  async function HandleSave(creatureToSave) {
    creatureToSave.owner = currentUser.uid;

    await (creatureToEdit ? api.put("UpdateCreature", creatureToSave) : api.post("SaveCreature", creatureToSave))
      .then((response) => {
        if (response.data) {
          let creatureIndex = creatures.findIndex((c) => c._id === response.data._id);
          if (creatureIndex >= 0) {
            creatures.splice(creatureIndex, 1, creatureToSave);
          } else {
            creatures.push(creatureToSave);
          }

          setIsEditCreatureOpen(false);
        }
      })
      .catch((err) => {
        console.log("error in SaveCreature", err);
      });
  }

  function HandleDelete(creatureToDelete) {
    api
      .delete("DeleteCreature", { params: { id: creatureToDelete._id } })
      .then((response) => {
        if (response.data) {
          let creatureIndex = creatures.findIndex((c) => c._id === response.data._id);

          creatures.splice(creatureIndex, 1);

          setCreatures(creatures);
          setIsEditCreatureOpen(false);
        }
      })
      .catch((err) => {
        console.log("error in DeleteCreature", err);
      });
  }

  return !creatures ? (
    <div className="backend-loading">
      <h2>Por favor aguarde enquanto tiramos o site de inativade. Isso pode lever até 30 segundos...</h2>
    </div>
  ) : (
    <div className="Home-container">
      <NaviBar
        combats={combats}
        selectedCharacters={selectedCharacters}
        setSelectedCharacters={setSelectedCharacters}
        selectedCreatures={selectedCreatures}
        setSelectedCreatures={setSelectedCreatures}
        isSelectingParty={isSelectingParty}
        isSelectingBestiary={isSelectingBestiary}
        setIsSelectingParty={setIsSelectingParty}
        setIsSelectingBestiary={setIsSelectingBestiary}
        isPartyOpen={isPartyOpen}
        setIsPartyOpen={setIsPartyOpen}
        isBestiaryOpen={isBestiaryOpen}
        setIsBestiaryOpen={setIsBestiaryOpen}
        level={level}
        setLevel={setLevel}
        groups={groups}
        setGroups={setGroups}
        creatures={creatures}
        setCreatures={setCreatures}
        tabOptions={MAIN_TABS}
        openTab={openTab}
        setOpenTab={setOpenTab}
        isEditCreatureOpen={isEditCreatureOpen}
        setCreatureToEdit={setCreatureToEdit}
        setIsEditCreatureOpen={setIsEditCreatureOpen}
        HandleEndCombat={HandleEndCombat}
      />
      <img src={background} alt="Created by liuzishan - www.freepik.com" />

      <div className={`section-wrapper ${isEditCreatureOpen ? "hidden" : ""}`}>
        <div className={`section-wrapper ${openTab !== MAIN_TABS.SKILL_CHECK ? "hidden" : ""}`}>
          <SkillCheck resultText={openTab} level={level} />
        </div>
        <div style={{ marginTop: 75, height: "fit-content" }} className={`section-wrapper ${openTab !== MAIN_TABS.GENERAL ? "hidden" : ""}`}>
          <Panel title="Versao 1.2">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>Motivaçoes</p>
              <span>Abstrair o processo de criacao de criaturas, o tornando subjetivo e simples</span>
              <span>
                A ficha de uma criatura é, e deveria ser, desconhecida pelos jogadores, logo algumas liberdades podem ser tomadas durante a criaçao
              </span>
              <span>
                Descriçoes excessivas, recargas, multiataque, magias, ações bonus, ações lendárias, e outros foram simplificados para facilitar o
                controle de criaturas
              </span>
              <span>Ter um sistema de forja de items</span>
              <span>Acrescentar novas opcoes ao combate como Pontos Fracos, Comportamentos, e raridade de açoes</span>
              <p>-</p>
              <p>Notas</p>
              <span>Em version mobile, use a posiçao paisagem</span>
              <span>Escalas de Poder ofensiva e defensiva de criatura ainda nao estao funcionando(fixas em 50%)</span>
              <span>No Foundry, ficha de criatura recomendada: "Monster Blocks"</span>
              <span>No Foundry, módulo de controle de criatura recomendado: "Token Action HUD"</span>
              <span>No Foundry, Pontos Fracos estao junto ao PV na ficha e opcoes de Compartamento estao em Efeitos</span>
              <span>No Foundry, tokens sao genericos, por enquanto</span>
              <p>-</p>
              <p>Próximas Funcionalidades</p>
              <span>Escalas de Poder</span>
              <span>Simulador de Encontro</span>
              <span>Gerenciador de Combates</span>
            </div>
          </Panel>
        </div>
        <div className={`section-wrapper ${openTab !== MAIN_TABS.COMBAT ? "hidden" : ""}`}>
          <CombatSetup
            selectedCharacters={selectedCharacters}
            selectedCreatures={selectedCreatures}
            setSelectedCreatures={setSelectedCreatures}
            HandleSelectFromParty={HandleSelectFromParty}
            HandleSelectFromBestiary={HandleSelectFromBestiary}
            HandleGenerateCombat={HandleGenerateCombat}
            resultText={openTab}
            level={level}
          />
        </div>
        {combats.map((combat, index) => (
          <div key={index} className={`section-wrapper ${openTab !== index + 1 ? "hidden" : ""}`}>
            <Combat combat={combat} />
          </div>
        ))}

        <div className={`section-wrapper ${openTab !== MAIN_TABS.TREASURE ? "hidden" : ""}`}>
          <Treasure resultText={openTab} level={level} />
        </div>
      </div>

      {isEditCreatureOpen && (
        <div className={"section-wrapper"}>
          <EditCreature
            creatureToEdit={creatureToEdit}
            HandleSave={HandleSave}
            HandleDelete={HandleDelete}
            FinishEditing={() => setIsEditCreatureOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
