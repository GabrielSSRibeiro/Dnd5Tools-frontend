import React, { useState } from "react";
//  import api from "../../services/api";

import { LEVELS } from "../../../Tables/party";

import Button from "../../Button";
import Select from "../../Select";
import CheckInput from "../../CheckInput";
import TextInput from "../../TextInput";

import "./styles.css";

function Party({ isPartyOpen, setIsPartyOpen, level, setLevel, groups, setGroups, isSelecting, setIsSelecting }) {
  const [inactiveGroup, setInactiveGroup] = useState([]);
  const [isNewCharacterOpen, setIsNewCharacterOpen] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState(null);
  const [newCharacterGroup, setNewCharacterGroup] = useState(null);
  const [characterBeenEdited, setCharacterBeenEdited] = useState(null);
  const [newEditedCharacterName, setNewEditedCharacterName] = useState(null);
  const [selectedCharacters, setSelectedCharacters] = useState([]);

  const numberOfCharacters = groups.reduce((acc, current) => acc.concat(current), []).length;
  let groupOptions = groups.map((group, index) => `Grupo ${index + 1}`);
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  function HandleClose() {
    setIsSelecting(false);
    setIsPartyOpen(false);
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

    //save in db

    setCharacterBeenEdited(null);
  }

  function HandleSelectCharacters(character) {
    const isAlreadySelected = selectedCharacters.some((selectedCharacter) => selectedCharacter === character);
    let newSelection = selectedCharacters.filter((selectedCharacter) => selectedCharacter !== character);

    if (!isAlreadySelected) {
      newSelection.push(character);
    }

    setSelectedCharacters(newSelection);
  }

  function AllowToSelect(groupIndex) {
    if (selectedCharacters.length === 0) {
      return true;
    }

    if (groupIndex !== null) {
      return selectedCharacters.some((selectedCharacter) => groups[groupIndex].includes(selectedCharacter));
    } else {
      return selectedCharacters.some((selectedCharacter) => inactiveGroup.includes(selectedCharacter));
    }
  }

  function HandleDelete(groupIndex) {
    if (groupIndex !== null) {
      let updatedGroups = groups;

      //filter selected characters
      updatedGroups[groupIndex] = updatedGroups[groupIndex].filter((character) => !selectedCharacters.includes(character));

      //filter empty groups
      updatedGroups = updatedGroups.filter((group) => group.length !== 0);

      setGroups(updatedGroups);
    } else {
      let updatedGroup = inactiveGroup;
      updatedGroup = updatedGroup.filter((character) => !selectedCharacters.includes(character));

      setInactiveGroup(updatedGroup);
    }

    //save in db

    setSelectedCharacters([]);
  }

  function HandleSwapSelected(newGroupName, currentGroupIndex) {
    let updatedGroups = groups;

    if (currentGroupIndex !== null) {
      //filter selected characters
      updatedGroups[currentGroupIndex] = updatedGroups[currentGroupIndex].filter((character) => !selectedCharacters.includes(character));

      //filter empty groups
      updatedGroups = updatedGroups.filter((group) => group.length !== 0);
    } else {
      let updatedGroup = inactiveGroup;
      updatedGroup = updatedGroup.filter((character) => !selectedCharacters.includes(character));

      setInactiveGroup(updatedGroup);
    }

    const groupIndex = groupOptions.indexOf(newGroupName);
    const inactiveCharacters = groupOptions.length - 1;
    const newGroup = groupOptions.length - 2;

    if (groupIndex === inactiveCharacters) {
      setInactiveGroup([...inactiveGroup, ...selectedCharacters]);
    } else if (groupIndex === newGroup) {
      updatedGroups.push(selectedCharacters);
    } else {
      updatedGroups[groupIndex].push(...selectedCharacters);
    }

    //save in db

    setGroups(updatedGroups);
    setSelectedCharacters([]);
  }

  return (
    <div className="Party-container">
      {isSelecting && <div className="screen-block"></div>}
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
            {!isSelecting ? <h5>{numberOfCharacters} PERSONAGENS</h5> : <h5>Selecione o grupo para esse combate</h5>}
            <div>
              {!isSelecting && (
                <>
                  <h5>Nível</h5>
                  <Select value={level} onSelect={setLevel} options={LEVELS} />
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
                  <Button text="Adicionar Personagem" onClick={() => setIsNewCharacterOpen(true)} />
                </aside>
              ) : (
                <div className="add-new-container">
                  <div className="add-new">
                    <div className="cancel-add-new" onClick={() => setIsNewCharacterOpen(false)}>
                      <i class="fas fa-times"></i>
                    </div>
                    <section>
                      <span>Nome do Personagem</span>
                      <TextInput
                        value={newCharacterName}
                        onChange={(e) => {
                          setNewCharacterName(e.target.value);
                        }}
                      />
                    </section>
                    <section>
                      <span>Grupo</span>
                      <Select
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
                <main className={isSelecting ? "selecting-group" : ""}>
                  <div className="group-header">
                    <header>
                      {isSelecting && <CheckInput onClick={() => {}} isSelected={false} />}
                      <h5>Grupo {groupIndex + 1}</h5>
                    </header>
                    {selectedCharacters.length > 0 && AllowToSelect(groupIndex) && (
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
                      <div className="group-character">
                        {characterBeenEdited !== character ? (
                          <>
                            {!isSelecting && AllowToSelect(groupIndex) && (
                              <CheckInput
                                onClick={() => HandleSelectCharacters(character)}
                                isSelected={selectedCharacters.some((char) => char === character)}
                              />
                            )}
                            <h6>{character}</h6>
                            <div className="enable-edit-character" onClick={() => HandleOpenCharacterEdit(character)}>
                              {!isSelecting && <i class="fas fa-pencil-alt"></i>}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="edit-character">
                              <input
                                onChange={(e) => setNewEditedCharacterName(e.target.value)}
                                placeholder="Nome"
                                value={newEditedCharacterName}
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
              {inactiveGroup.length > 0 && (
                <main>
                  <div className="group-header">
                    <h5>Inativos</h5>
                    {selectedCharacters.length > 0 && AllowToSelect(null) && (
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
                      <div className="group-character">
                        {characterBeenEdited !== character ? (
                          <>
                            {AllowToSelect(null) && (
                              <CheckInput
                                onClick={() => HandleSelectCharacters(character)}
                                isSelected={selectedCharacters.some((char) => char === character)}
                              />
                            )}
                            <h6>{character}</h6>
                            <div className="enable-edit-character" onClick={() => HandleOpenCharacterEdit(character)}>
                              <i class="fas fa-pencil-alt"></i>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="edit-character">
                              <input
                                onChange={(e) => setNewEditedCharacterName(e.target.value)}
                                placeholder="Nome"
                                value={newEditedCharacterName}
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
              <h5>Nenhum grupo selecionado</h5>
              <Button text="Confirmar" onClick={HandleClose} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Party;
