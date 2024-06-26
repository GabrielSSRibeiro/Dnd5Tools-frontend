import React, { useState, useEffect, useRef } from "react";

import { LEVELS } from "../../../../constants/combatConstants";
import { SYSTEM_TYPES, MAX_CHARACTERS_ALLOWED } from "../../../../constants/combatConstants";

import ModalCalcXp from "../../../ModalCalcXp";
import Button from "../../../Button";
import Select from "../../../Select";
import CheckInput from "../../../CheckInput";
import TextInput from "../../../TextInput";

import "./styles.css";

function Party({
  systemType,
  selectedCharacters,
  setSelectedCharacters,
  isSelecting,
  setIsSelecting,
  isPartyOpen,
  setIsPartyOpen,
  HandleSaveCombatConfig,
  level,
  setLevel,
  groups,
  setGroups,
  inactiveGroup,
  setInactiveGroup,
  setModal,
}) {
  const [isNewCharacterOpen, setIsNewCharacterOpen] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState(null);
  const [newCharacterGroup, setNewCharacterGroup] = useState(null);
  const [characterBeenEdited, setCharacterBeenEdited] = useState(null);
  const [newEditedCharacterName, setNewEditedCharacterName] = useState(null);
  const [selectedCharactersInGroup, setSelectedCharactersInGroup] = useState([]);
  const [tempSelectedCharacters, setTempSelectedCharacters] = useState(selectedCharacters);

  const maxNumberOfCharacters = useRef(100);
  const numberOfCharacters = groups.reduce((acc, current) => acc.concat(current), []).length;
  let groupOptions = groups.map((group, index) => `Grupo ${index + 1}`);

  function HandleSelectedFromParty() {
    HandleClose();
    setSelectedCharacters(tempSelectedCharacters);
  }

  function HandleSelectGroup(selectedGroup) {
    const isAlreadySelected = tempSelectedCharacters.some((selectedCharacter) => selectedGroup.includes(selectedCharacter));
    let newSelection = tempSelectedCharacters.filter((selectedCharacter) => !selectedGroup.includes(selectedCharacter));

    if (!isAlreadySelected && tempSelectedCharacters.length + selectedGroup.length <= MAX_CHARACTERS_ALLOWED) {
      newSelection.push(...selectedGroup);
    }
    setTempSelectedCharacters(newSelection);
  }

  function HandleClose() {
    setTempSelectedCharacters(selectedCharacters);
    setSelectedCharactersInGroup([]);
    setIsSelecting(false);
    setIsNewCharacterOpen(false);
    setIsPartyOpen(false);

    if (!isSelecting) {
      HandleSaveCombatConfig();
    }
  }

  function GetGroupSelectionOptions() {
    groupOptions.push("Novo Grupo", "Inativos");
    return groupOptions;
  }

  function HandleAddNew(character, group) {
    const groupIndex = groupOptions.indexOf(group);
    const inactiveCharacters = groupOptions.length - 1;
    const newGroup = groupOptions.length - 2;

    if (groupIndex === inactiveCharacters) {
      setInactiveGroup([...inactiveGroup, character]);
    } else if (groupIndex === newGroup) {
      setGroups([...groups, [character]]);
    } else {
      let updatedGroups = groups;
      updatedGroups[groupIndex].push(character);
      setGroups(updatedGroups);
    }

    setIsNewCharacterOpen(false);
    setNewCharacterName(null);
    setNewCharacterGroup(null);
    setSelectedCharacters([]);
  }

  function HandleOpenCharacterEdit(character) {
    setCharacterBeenEdited(character);
    setNewEditedCharacterName(character);
  }

  function HandleEditCharacter(characterIndex, groupIndex) {
    if (groupIndex !== null) {
      let updatedGroups = groups;
      updatedGroups[groupIndex][characterIndex] = newEditedCharacterName;

      setGroups(updatedGroups);
    } else {
      let updatedGroup = inactiveGroup;
      updatedGroup[characterIndex] = newEditedCharacterName;

      setInactiveGroup(updatedGroup);
    }

    setCharacterBeenEdited(null);
    setSelectedCharacters([]);
  }

  function HandleSelectCharacters(character) {
    const isAlreadySelected = selectedCharactersInGroup.some((selectedCharacter) => selectedCharacter === character);
    let newSelection = selectedCharactersInGroup.filter((selectedCharacter) => selectedCharacter !== character);

    if (!isAlreadySelected) {
      newSelection.push(character);
    }

    setSelectedCharactersInGroup(newSelection);
  }

  function AllowToSelect(groupIndex) {
    if (selectedCharactersInGroup.length === 0) {
      return true;
    }

    if (groupIndex !== null) {
      return selectedCharactersInGroup.some((selectedCharacter) => groups[groupIndex].includes(selectedCharacter));
    } else {
      return selectedCharactersInGroup.some((selectedCharacter) => inactiveGroup.includes(selectedCharacter));
    }
  }

  function HandleDelete(groupIndex) {
    if (groupIndex !== null) {
      let updatedGroups = groups;

      //filter selected characters
      updatedGroups[groupIndex] = updatedGroups[groupIndex].filter((character) => !selectedCharactersInGroup.includes(character));

      //filter empty groups
      updatedGroups = updatedGroups.filter((group) => group.length !== 0);

      setGroups(updatedGroups);
    } else {
      let updatedGroup = inactiveGroup;
      updatedGroup = updatedGroup.filter((character) => !selectedCharactersInGroup.includes(character));

      setInactiveGroup(updatedGroup);
    }

    setSelectedCharactersInGroup([]);
    setSelectedCharacters([]);
  }

  function HandleSwapSelected(newGroupName, currentGroupIndex) {
    let updatedGroups = groups;

    if (currentGroupIndex !== null) {
      //filter selected characters
      updatedGroups[currentGroupIndex] = updatedGroups[currentGroupIndex].filter((character) => !selectedCharactersInGroup.includes(character));

      //filter empty groups
      updatedGroups = updatedGroups.filter((group) => group.length !== 0);
    } else {
      let updatedGroup = inactiveGroup;
      updatedGroup = updatedGroup.filter((character) => !selectedCharactersInGroup.includes(character));

      setInactiveGroup(updatedGroup);
    }

    const groupIndex = groupOptions.indexOf(newGroupName);
    const inactiveCharacters = groupOptions.length - 1;
    const newGroup = groupOptions.length - 2;

    if (groupIndex === inactiveCharacters) {
      setInactiveGroup([...inactiveGroup, ...selectedCharactersInGroup]);
    } else if (groupIndex === newGroup) {
      updatedGroups.push(selectedCharactersInGroup);
    } else {
      updatedGroups[groupIndex].push(...selectedCharactersInGroup);
    }

    setGroups(updatedGroups);
    setSelectedCharactersInGroup([]);
    setSelectedCharacters([]);
  }

  function OpenModalCalcXp() {
    setIsPartyOpen(false);
    setModal(<ModalCalcXp level={level} onClose={CloseModalCalcXp} />);
  }
  function CloseModalCalcXp() {
    setModal(null);
    setIsPartyOpen(true);
  }

  useEffect(() => {
    setTempSelectedCharacters(selectedCharacters);
  }, [selectedCharacters]);

  return (
    <div className="Party-container">
      {isSelecting && <div className="screen-block" onClick={HandleClose}></div>}
      <div
        className="sharp-button"
        onClick={() => {
          setIsPartyOpen(true);
        }}
      >
        {/* border 2 */}
        <div>
          <main />
          <aside />
        </div>
        {/* border 1 */}
        <div>
          <main />
          <aside />
        </div>
        <div>
          {/* button body */}
          <main>
            <h5>{numberOfCharacters} PERSONAGENS</h5>
            <h6>Nível {level}</h6>
          </main>
          <aside />
        </div>
      </div>
      {isPartyOpen && (
        <div className="party-tab">
          <header className={isSelecting ? "selecting-header" : ""}>
            {!isSelecting ? (
              <h5>{numberOfCharacters} PERSONAGENS</h5>
            ) : (
              <h5>
                {tempSelectedCharacters.length} de até {MAX_CHARACTERS_ALLOWED} personagens selecionados
              </h5>
            )}
            <div>
              {!isSelecting && systemType === SYSTEM_TYPES.DND_5E && (
                <>
                  <button className="button-simple calc-xp" onClick={OpenModalCalcXp}>
                    Calcular XP
                  </button>
                  <h5>Nível</h5>
                  <Select value={level} onSelect={setLevel} options={LEVELS} optionsAtATime={10} className="level-select" />
                </>
              )}
              <div className="sharp-button" onClick={HandleClose}>
                {/* border 2 */}
                <div>
                  <aside />
                  <main />
                </div>
                {/* border 1 */}
                <div>
                  <aside />
                  <main />
                </div>
                {/* button body */}
                <div>
                  <aside />
                  <main />
                </div>
              </div>
            </div>
          </header>

          <main>
            {!isSelecting &&
              (!isNewCharacterOpen ? (
                <aside>
                  <Button
                    text="Adicionar Personagem"
                    onClick={() => setIsNewCharacterOpen(true)}
                    isDisabled={numberOfCharacters >= maxNumberOfCharacters}
                  />
                </aside>
              ) : (
                <div className="add-new-container">
                  <div className="add-new">
                    <div className="cancel-add-new" onClick={() => setIsNewCharacterOpen(false)}>
                      <i className="fas fa-times"></i>
                    </div>
                    <section>
                      <TextInput label="Nome do Personagem" value={newCharacterName} onChange={setNewCharacterName} />
                    </section>
                    <section>
                      <Select
                        label="Grupo"
                        isLarge={true}
                        extraWidth={150}
                        value={newCharacterGroup}
                        onSelect={setNewCharacterGroup}
                        options={GetGroupSelectionOptions()}
                      />
                    </section>
                  </div>
                  <Button
                    text="Salvar"
                    onClick={() => HandleAddNew(newCharacterName, newCharacterGroup)}
                    isDisabled={!newCharacterName || !newCharacterGroup}
                  />
                </div>
              ))}
            <div className="party-groups">
              {groups.map((group, groupIndex) => (
                <main
                  key={groupIndex}
                  onClick={() => (isSelecting ? HandleSelectGroup(group) : {})}
                  className={`${isSelecting ? "selecting-group" : ""} ${
                    isSelecting && tempSelectedCharacters.some((selectedCharacter) => group.includes(selectedCharacter)) ? "selected-group" : ""
                  }`}
                >
                  <div className="group-header">
                    <header>
                      {isSelecting && (
                        <CheckInput isSelected={tempSelectedCharacters.some((selectedCharacter) => group.includes(selectedCharacter))} />
                      )}
                      <h5>Grupo {groupIndex + 1}</h5>
                      {/* <h5> / Nível X</h5> */}
                      {/* {!isSelecting && selectedCharactersInGroup.length === 0 && (
                        <button className="group-feats" onClick={() => {}}>
                          FEITOS
                        </button>
                      )} */}
                    </header>
                    {selectedCharactersInGroup.length > 0 && AllowToSelect(groupIndex) && (
                      <div className="header-options">
                        <Select
                          extraWidth={50}
                          value="Mover Para"
                          onSelect={(newGroup) => HandleSwapSelected(newGroup, groupIndex)}
                          options={GetGroupSelectionOptions().filter((group, index) => index !== groupIndex)}
                        />
                        <button onClick={() => HandleDelete(groupIndex)}>DELETAR</button>
                      </div>
                    )}
                  </div>
                  <div className="group-characters" style={{ borderWidth: !isSelecting ? 1 : 0 }}>
                    {group.map((character, characterIndex) => (
                      <div key={character} className="group-character">
                        {characterBeenEdited !== character ? (
                          <>
                            {!isSelecting && AllowToSelect(groupIndex) && (
                              <CheckInput
                                onClick={() => HandleSelectCharacters(character)}
                                isSelected={selectedCharactersInGroup.some((char) => char === character)}
                              />
                            )}
                            <h6>{character}</h6>
                            <div className="enable-edit-character" onClick={() => HandleOpenCharacterEdit(character)}>
                              {!isSelecting && <i className="fas fa-pencil-alt"></i>}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="edit-character">
                              <input
                                onChange={(e) => setNewEditedCharacterName(e.target.value)}
                                placeholder="Nome"
                                value={newEditedCharacterName ?? ""}
                              ></input>
                              <button onClick={() => HandleEditCharacter(characterIndex, groupIndex)}>SALVAR</button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </main>
              ))}
              {!isSelecting && inactiveGroup.length > 0 && (
                <main>
                  <div className="group-header">
                    <h5>Inativos</h5>
                    {selectedCharactersInGroup.length > 0 && AllowToSelect(null) && (
                      <div className="header-options">
                        <Select
                          extraWidth={50}
                          value="Mover Para"
                          onSelect={(newGroup) => HandleSwapSelected(newGroup, null)}
                          options={GetGroupSelectionOptions().filter((group) => group !== groupOptions[groupOptions.length - 1])}
                        />
                        <button onClick={() => HandleDelete(null)}>DELETAR</button>
                      </div>
                    )}
                  </div>
                  <div className="group-characters">
                    {inactiveGroup.map((character, characterIndex) => (
                      <div key={character} className="group-character">
                        {characterBeenEdited !== character ? (
                          <>
                            {AllowToSelect(null) && (
                              <CheckInput
                                onClick={() => HandleSelectCharacters(character)}
                                isSelected={selectedCharactersInGroup.some((char) => char === character)}
                              />
                            )}
                            <h6>{character}</h6>
                            <div className="enable-edit-character" onClick={() => HandleOpenCharacterEdit(character)}>
                              <i className="fas fa-pencil-alt"></i>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="edit-character">
                              <input
                                onChange={(e) => setNewEditedCharacterName(e.target.value)}
                                placeholder="Nome"
                                value={newEditedCharacterName ?? ""}
                              ></input>
                              <button onClick={() => HandleEditCharacter(characterIndex, null)}>SALVAR</button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </main>
              )}
            </div>
          </main>
          {isSelecting && (
            <div className="selecting-footer">
              <h5>
                {/* {tempSelectedCharacters.length > 0
                  ? `${tempSelectedCharacters.length} personagem(s} selecionado(s)`
                  : "Nenhum personagem selecionado"} */}
              </h5>
              <Button text="Confirmar" onClick={HandleSelectedFromParty} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Party;
