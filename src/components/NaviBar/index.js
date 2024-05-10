import React, { useState } from "react";
import { useAuth } from "../../contexts/Auth";
import { useHistory } from "react-router-dom";

import SelectButton from "../SelectButton";
import ModalTextArea from "../../components/ModalTextArea";
import Party from "./components/Party";
import Bestiary from "./components/Bestiary";
import ModalSettings from "./components/ModalSettings";

import "./styles.css";

function NaviBar({
  combats,
  selectedCharacters,
  setSelectedCharacters,
  selectedCreatures,
  HandleSelectedFromBestiary,
  isSelectingParty,
  setIsSelectingParty,
  isSelectingBestiary,
  setIsSelectingBestiary,
  isPartyOpen,
  setIsPartyOpen,
  isBestiaryOpen,
  setIsBestiaryOpen,
  combatConfig,
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

  async function OpenModalSettings() {
    setModal(
      <ModalSettings
        combatConfig={combatConfig}
        onClickToClose={() => setModal(null)}
        HandleSaveCombatConfig={HandleSaveCombatConfig}
        HandleLogout={HandleLogout}
      />
    );
  }

  function OpenModalDetails() {
    setModal(<ModalTextArea title={"Notas"} text={combatConfig.notes} onClose={HandleCloseModalTextArea} />);
  }
  function HandleCloseModalTextArea(tempNotes) {
    combatConfig.notes = tempNotes;
    HandleSaveCombatConfig();

    setModal(null);
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
        <div className="df df-cg-15">
          <button title="Notas" className="df button-simple" onClick={OpenModalDetails}>
            <i className="fas fa-book"></i>
          </button>
          <button className="button-simple menu" onClick={OpenModalSettings}>
            Configurações
          </button>
        </div>
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
            setModal={setModal}
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
              isSelected={openTab === tabOptions.MAP}
              isLong={true}
              text={tabOptions.MAP}
              onClick={() => setOpenTab(tabOptions.MAP)}
            />
            {/* <SelectButton
              isLarge={true}
              isSelected={openTab === tabOptions.COMBAT}
              isLong={true}
              text={tabOptions.COMBAT}
              onClick={() => setOpenTab(tabOptions.COMBAT)}
              isDisabled={combats.length >= MAX_COMBATS}
            /> */}
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
            HandleSelectedFromBestiary={HandleSelectedFromBestiary}
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
