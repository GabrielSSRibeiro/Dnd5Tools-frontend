import React from "react";

import { MAX_COMBATS } from "../../Tables/combat";

import SelectButton from "../SelectButton";
import Party from "../Sections/Party";
import Bestiary from "../Sections/Bestiary";

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
  setCreatures,
  tabOptions,
  setIsMenuOpen,
  openTab,
  setOpenTab,
  isEditCreatureOpen,
  setIsEditCreatureOpen,
}) {
  return (
    <div className="NaviBar-container">
      <section>
        <div>
          <h3>A</h3>
          <h3>SCENDANCE</h3>
          <h4>Ferramentas D&amp;D 5</h4>
        </div>
        <button onClick={() => setIsMenuOpen(true)}>Menu</button>
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
                <div className="combat-buttons" style={{ zIndex: -1 - index }}>
                  <SelectButton isLarge={true} text={index + 1} onClick={() => setOpenTab(index + 1)} isSelected={openTab === index + 1} />
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
            setSelectedCreatures={setSelectedCreatures}
            isSelecting={isSelectingBestiary}
            setIsSelecting={setIsSelectingBestiary}
            isBestiaryOpen={isBestiaryOpen}
            setIsBestiaryOpen={setIsBestiaryOpen}
            setIsEditCreatureOpen={setIsEditCreatureOpen}
            creatures={creatures}
            setCreatures={setCreatures}
          />
        </section>
      )}
    </div>
  );
}

export default NaviBar;