import React, { useState } from "react";
import { useAuth } from "../../contexts/Auth";
import { useHistory } from "react-router-dom";

import { MAX_COMBATS } from "../../data/combatConstants";

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
  level,
  setLevel,
  groups,
  setGroups,
  creatures,
  tabOptions,
  openTab,
  setOpenTab,
  isEditCreatureOpen,
  setIsEditCreatureOpen,
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
      <Modal title="Menu" onClickToClose={() => setModal(null)} className="menu-modal-body">
        <Button text="Sair" onClick={HandleLogout} />
      </Modal>
    );
  }

  function HandleCombatTabClick(combatNumber) {
    if (openTab !== combatNumber) {
      setOpenTab(combatNumber);
    } else {
      HandleEndCombat();
    }
  }

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
      {!isEditCreatureOpen && (
        <section>
          <Party
            selectedCharacters={selectedCharacters}
            setSelectedCharacters={setSelectedCharacters}
            isSelecting={isSelectingParty}
            setIsSelecting={setIsSelectingParty}
            isPartyOpen={isPartyOpen}
            setIsPartyOpen={setIsPartyOpen}
            level={level}
            setLevel={setLevel}
            groups={groups}
            setGroups={setGroups}
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
            <div className="combat-buttons-container">
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
            </div>
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
            setIsEditCreatureOpen={setIsEditCreatureOpen}
            setCreatureToEdit={setCreatureToEdit}
            creatures={creatures}
          />
        </section>
      )}
    </div>
  );
}

export default NaviBar;
