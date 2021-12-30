import React, { useState } from "react";
//  import api from "../../services/api";

import { LEVELS } from "../../../Tables/party";

import Button from "../../Button";
import Select from "../../Select";
import CheckInput from "../../CheckInput";
import TextInput from "../../TextInput";

import "./styles.css";

function Party({ level, setLevel }) {
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [groups, setGroups] = useState([["Soiaz", "Foux", "Isaac"]]);
  const [inactiveGroup, setInactiveGroup] = useState([]);
  const [isNewCharacterOpen, setIsNewCharacterOpen] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState(null);
  const [newCharacterGroup, setNewCharacterGroup] = useState(null);
  const [isEditCharacterOpen, setIsEditCharacterOpen] = useState(false);

  const numberOfCharacters = groups.reduce((acc, current) => acc.concat(current), []).length;
  let groupOptions = groups.map((group, index) => `Grupo ${index + 1}`);

  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  function getNewCharacterGroupOptions() {
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

  function HandleSelect() {
    setSelected(!selected);
  }

  return (
    <div className="Party-container">
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
          <header>
            <h5>{numberOfCharacters} PERSONAGENS</h5>
            <div>
              <h5>Nível</h5>
              <Select value={level} onSelect={setLevel} options={LEVELS} />
              <div
                className="sharp-button"
                onClick={() => {
                  setIsPartyOpen(false);
                }}
              >
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
            {!isNewCharacterOpen ? (
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
                      options={getNewCharacterGroupOptions()}
                    />
                  </section>
                </div>
                <Button
                  text="Salvar"
                  onClick={() => HandleAddNew(newCharacterName, newCharacterGroup)}
                  isDisabled={!newCharacterName || !newCharacterGroup}
                />
              </div>
            )}
            <div className="party-groups">
              {groups.map((group, index) => (
                <main>
                  <h5>Grupo {index + 1}</h5>
                  <div>
                    <CheckInput onClick={HandleSelect} isSelected={selected} />
                  </div>
                </main>
              ))}
              {inactiveGroup.length > 0 && (
                <div className="inactive-group">
                  <h5>Inativos</h5>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default Party;
