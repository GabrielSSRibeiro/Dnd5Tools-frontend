import React, { useState } from "react";
import { useAuth } from "../../contexts/Auth";
import { useHistory } from "react-router-dom";

import { MAX_COMBATS } from "../../constants/combatConstants";

import SelectButton from "../SelectButton";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Party from "./components/Party";
import Bestiary from "./components/Bestiary";

import "./styles.css";

function NaviBar({
  combats,
  selectedCharacters,
  setSelectedCharacters,
  selectedCreatures,
  setSelectedCreatures,
  isSelectingParty,
  setIsSelectingParty,
  isSelectingBestiary,
  setIsSelectingBestiary,
  isPartyOpen,
  setIsPartyOpen,
  isBestiaryOpen,
  setIsBestiaryOpen,
  HandleSaveCombatConfig,
  level,
  setLevel,
  groups,
  setGroups,
  inactiveGroup,
  setInactiveGroup,
  creatures,
  tabOptions,
  openTab,
  setOpenTab,
  creatureToEdit,
  setCreatureToEdit,
  HandleEndCombat,
}) {
  const { Logout } = useAuth();
  const history = useHistory();

  const [modal, setModal] = useState(null);

  async function HandleLogout() {
    await Logout();
    history.push("/login");
  }

  async function OpenModalMenu() {
    setModal(
      <Modal title="Versao 1.5" onClickToClose={() => setModal(null)} className="menu-modal-body">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Motivaçoes</p>
          <span>Abstrair o processo de criacao de criaturas, o tornando subjetivo e simples</span>
          <span>
            A ficha de uma criatura é, e deveria ser, desconhecida pelos jogadores, logo algumas liberdades podem ser tomadas durante a criaçao
          </span>
          <span>
            Descriçoes excessivas, recargas, multiataque, magias, ações bonus, ações lendárias, e outros foram simplificados para facilitar o controle
            de criaturas
          </span>
          <span>Ter um sistema de forja de items</span>
          <span>Acrescentar novas opcoes táticas ao combate como Pontos Fracos, Comportamentos, e raridade de açoes</span>
          <p>-</p>
          <p>Notas</p>
          <span>Em versao de celular, use a posiçao paisagem</span>
          <span>No Foundry, ficha de criatura recomendada: "Monster Blocks"</span>
          <span>No Foundry, módulo de controle de criatura recomendado: "Token Action HUD"</span>
          <span>No Foundry, Pontos Fracos estao junto ao PV na ficha e opcoes de Compartamento estao em Efeitos</span>
          <span>No Foundry, tokens sao genericos, por enquanto</span>
          <p>-</p>
          <p>Próximas Funcionalidades</p>
          <span>Gerenciador de Combates</span>
        </div>
        <div className="divider"></div>
        <Button text="Sair" onClick={HandleLogout} />
      </Modal>
    );
  }

  // function HandleCombatTabClick(combatNumber) {
  //   if (openTab !== combatNumber) {
  //     setOpenTab(combatNumber);
  //   } else {
  //     HandleEndCombat();
  //   }
  // }

  return (
    <div className="NaviBar-container">
      {modal}
      <section>
        <div>
          <h3>A</h3>
          <h3>SCENDANCE</h3>
          <h4>Ferramentas D&amp;D 5</h4>
        </div>
        <button className="button-simple menu" onClick={OpenModalMenu}>
          Menu
        </button>
      </section>
      {!creatureToEdit && (
        <section>
          <Party
            selectedCharacters={selectedCharacters}
            setSelectedCharacters={setSelectedCharacters}
            isSelecting={isSelectingParty}
            setIsSelecting={setIsSelectingParty}
            isPartyOpen={isPartyOpen}
            setIsPartyOpen={setIsPartyOpen}
            HandleSaveCombatConfig={HandleSaveCombatConfig}
            level={level}
            setLevel={setLevel}
            groups={groups}
            setGroups={setGroups}
            inactiveGroup={inactiveGroup}
            setInactiveGroup={setInactiveGroup}
          />
          <SelectButton
            isLarge={true}
            isSelected={openTab === tabOptions.SKILL_CHECK}
            isLong={false}
            text={tabOptions.SKILL_CHECK}
            onClick={() => setOpenTab(tabOptions.SKILL_CHECK)}
          />
          <div className="combat-section">
            <SelectButton
              isLarge={true}
              isSelected={openTab === tabOptions.COMBAT}
              isLong={true}
              text={tabOptions.COMBAT}
              onClick={() => setOpenTab(tabOptions.COMBAT)}
              isDisabled={combats.length >= MAX_COMBATS}
            />
            {/* <div className="combat-buttons-container">
              {combats.map((combat, index) => (
                <div key={index} className="combat-buttons" style={{ zIndex: -1 - index }}>
                  <SelectButton
                    isLarge={true}
                    text={openTab !== index + 1 ? index + 1 : "X"}
                    onClick={() => HandleCombatTabClick(index + 1)}
                    isSelected={openTab === index + 1}
                    className="close"
                  />
                </div>
              ))}
            </div> */}
          </div>
          <SelectButton
            isLarge={true}
            isSelected={openTab === tabOptions.TREASURE}
            isLong={false}
            text={tabOptions.TREASURE}
            onClick={() => setOpenTab(tabOptions.TREASURE)}
          />
          <Bestiary
            selectedCreatures={selectedCreatures}
            selectedCharacters={selectedCharacters}
            level={level}
            setSelectedCreatures={setSelectedCreatures}
            isSelecting={isSelectingBestiary}
            setIsSelecting={setIsSelectingBestiary}
            isBestiaryOpen={isBestiaryOpen}
            setIsBestiaryOpen={setIsBestiaryOpen}
            setCreatureToEdit={setCreatureToEdit}
            creatures={creatures}
          />
        </section>
      )}
    </div>
  );
}

export default NaviBar;
