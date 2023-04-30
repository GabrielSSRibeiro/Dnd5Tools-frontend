import React, { useState } from "react";
import * as lc from "../../../../../../constants/locationConstants";
import { creatureRarities, creatureEnvironments } from "../../../../../../constants/creatureConstants";
import * as lh from "../../../../../../helpers/locationHelper";

import Button from "../../../../../../components/Button";
import TextInput from "../../../../../../components/TextInput";
import ModalWarning from "../../../../../../components/ModalWarning";
import Select from "../../../../../../components/Select";
import CheckInput from "../../../../../../components/CheckInput";
import ModalManagePartition from "./components/ModalManagePartition";
import ModalManageElement from "./components/ModalManageElement";
import ModalManageContext from "./components/ModalManageContext";
import ModalManageCreature from "./components/ModalManageCreature";

import "./styles.css";

function EditLocation({ locationToEdit, HandleSave, HandleDelete, FinishEditing, HandleSelectFromBestiary, setSelectedCreatures, creatures }) {
  const [location, setLocation] = useState(locationToEdit);
  const [modal, setModal] = useState(null);

  function HandleSaveLocation() {
    //valores reais
    location.radiusMultiplier = lh.GetRadius(location.size);

    HandleSave(location);
  }

  function OpenDeleteConfirmation() {
    setModal(
      <ModalWarning
        title="Deletar Localização"
        message="Tem certeza que deseja deletar essa localização?"
        cancelText="Cancelar"
        onCancel={setModal}
        confirmText="Deletar"
        onConfirm={() => HandleDelete(location)}
      />
    );
  }

  function HandleSelectContext(context) {
    location.contexts.forEach((c) => {
      c.isCurrent = c.name === context.name && !c.isCurrent;
    });
    setLocation({ ...location });
  }

  function OpenModalManagePartition(partition) {
    setModal(
      <ModalManagePartition
        partition={partition}
        partitions={location.traversal.partitions}
        onClose={(tempPartition) => HandleCloseModalManagePartition(partition, tempPartition)}
      />
    );
  }
  function HandleCloseModalManagePartition(partition, tempPartition) {
    if (tempPartition) {
      if (partition) {
        let index = location.traversal.partitions.findIndex((p) => p.type === partition.type);
        location.traversal.partitions.splice(index, 1, tempPartition);
      } else {
        location.traversal.partitions.push(tempPartition);
      }

      setLocation({ ...location });
    }

    setModal(null);
  }
  function DeletePartition(partition) {
    location.traversal.partitions = location.traversal.partitions.filter((p) => p.type !== partition.type);
    setLocation({ ...location });
  }

  function OpenModalManageElement(element) {
    setModal(
      <ModalManageElement
        element={element}
        elements={location.traversal.elements}
        onClose={(tempElement) => HandleCloseModalManageElement(element, tempElement)}
      />
    );
  }
  function HandleCloseModalManageElement(element, tempElement) {
    if (tempElement) {
      if (element) {
        let index = location.traversal.elements.findIndex((e) => e.type === element.type);
        location.traversal.elements.splice(index, 1, tempElement);
      } else {
        location.traversal.elements.push(tempElement);
      }

      setLocation({ ...location });
    }

    setModal(null);
  }
  function DeleteElement(element) {
    location.traversal.elements = location.traversal.elements.filter((e) => e.type !== element.type);
    setLocation({ ...location });
  }

  function OpenModalManageContext(context) {
    let invalidNames = location.contexts.filter((c) => c.name !== context?.name).map((c) => c.name);

    setModal(
      <ModalManageContext
        context={context}
        isDefault={context && location.contexts.some((c, i) => c.name === context.name && i === 0)}
        invalidNames={invalidNames}
        onClose={(tempContext) => HandleCloseModalManageContext(context, tempContext)}
      />
    );
  }
  function HandleCloseModalManageContext(context, tempContext) {
    if (tempContext) {
      if (context) {
        if (context.name !== tempContext.name) {
          location.creatures.forEach((c) => {
            c.routines
              .filter((r) => r.context === context.name)
              .forEach((r) => {
                r.context = tempContext.name;
              });
          });
        }

        let index = location.contexts.findIndex((p) => p.name === context.name);
        location.contexts.splice(index, 1, tempContext);
      } else {
        location.contexts.push(tempContext);
      }

      setLocation({ ...location });
    }

    setModal(null);
  }
  function DeleteContext(context) {
    location.contexts = location.contexts.filter((p) => p.name !== context.name);
    setLocation({ ...location });
  }

  function OpenModalManageCreature(creature) {
    setModal(
      <ModalManageCreature
        creature={creature}
        contexts={location.contexts.map((c) => c.name)}
        onClose={(tempCreature) => HandleCloseModalManageCreature(creature, tempCreature)}
      />
    );
  }
  function HandleCloseModalManageCreature(creature, tempCreature) {
    if (tempCreature) {
      if (creature) {
        let index = location.creatures.findIndex((p) => p.creatureId === creature.creatureId);
        location.creatures.splice(index, 1, tempCreature);
      } else {
        location.creatures.push(tempCreature);
      }

      setLocation({ ...location });
    }

    setModal(null);
  }
  function DeleteCreature(creature) {
    location.creatures = location.creatures.filter((p) => p.creatureId !== creature.creatureId);
    setLocation({ ...location });
  }

  function HandleSelectCreatures() {
    setSelectedCreatures(creatures.filter((c) => location.creatures.some((lc) => lc.creatureId === c._id)));
    HandleSelectFromBestiary(HandleSelectedCreatures);
  }

  function HandleSelectedCreatures(tempSelectedCreatures) {
    //remove removed creatures
    location.creatures = location.creatures.filter((lc) => tempSelectedCreatures.some((sc) => sc._id === lc.creatureId));

    //Add new creatures
    tempSelectedCreatures
      .filter((sc) => !location.creatures.some((lc) => lc.creatureId === sc._id))
      .forEach((sc) => {
        location.creatures.push({
          creatureId: sc._id,
          routines: [
            {
              encounterFrequency: lc.ENCOUNTER_FREQUENCIES.MEDIUM,
            },
          ],
        });
      });
    setLocation({ ...location });
  }

  function IsLocationValid() {
    if (!location.name) {
      return false;
    }

    return true;
  }

  return (
    <div className="EditLocation-container">
      {modal}
      <h3>Localização</h3>
      <main className="location-fields">
        <TextInput label="Nome" value={location} valuePropertyPath="name" onChange={setLocation} />

        {location.exteriorLocationId != null && (
          <Select
            label={"Tamanho"}
            extraWidth={250}
            value={location}
            valuePropertyPath="size"
            onSelect={setLocation}
            nothingSelected="Ponto de Interesse"
            options={lc.locationSizes}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
          />
        )}

        <div className="divider"></div>

        {location.size || location.exteriorLocationId == null ? (
          <>
            <Select
              label={"Tipo"}
              extraWidth={250}
              value={location}
              valuePropertyPath="traversal.type"
              onSelect={setLocation}
              options={creatureEnvironments}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Chance de Terreno Irregular"}
              extraWidth={250}
              value={location}
              valuePropertyPath="traversal.irregularTerrainFrequency"
              onSelect={setLocation}
              options={lc.irregularTerrainFrequencies}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            {location.exteriorLocationId != null && (
              <div className="location-detail-group">
                <div className="location-detail-group-title">
                  <span>Partições</span>
                  <button onClick={() => OpenModalManagePartition()} disabled={location.traversal.partitions.length === 2}>
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                {location.traversal.partitions.map((p) => (
                  <div className="location-detail-group-item" key={p.type}>
                    <span>{lc.GetPartitionType(p.type).display}</span>
                    <div className="group-item-actions">
                      <button onClick={() => OpenModalManagePartition(p)}>
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button onClick={() => DeletePartition(p)}>
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {location.exteriorLocationId != null && (
              <div className="location-detail-group">
                <div className="location-detail-group-title">
                  <span>Elementos</span>
                  <button onClick={() => OpenModalManageElement()} disabled={location.traversal.elements.length === 6}>
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                {location.traversal.elements.map((e) => (
                  <div className="location-detail-group-item" key={e.type}>
                    <span>{lc.GetPartitionType(e.type).display}</span>
                    <div className="group-item-actions">
                      <button onClick={() => OpenModalManageElement(e)}>
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button onClick={() => DeleteElement(e)}>
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <Select
              label={"Tipo"}
              extraWidth={250}
              value={location}
              valuePropertyPath="interaction.type"
              onSelect={setLocation}
              options={lc.elementTypes}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <CheckInput
              label="Perigoso"
              onClick={() => setLocation({ ...location, interaction: { ...location.interaction, isHazardous: !location.interaction.isHazardous } })}
              isSelected={location.interaction.isHazardous}
            />
            {lc.GetElementType(location.interaction.type)?.canBeMaterial && (
              <Select
                label={"Raridade de Material"}
                extraWidth={250}
                value={location}
                valuePropertyPath="interaction.rarity"
                onSelect={setLocation}
                nothingSelected="Nenhuma"
                options={creatureRarities}
                optionDisplay={(o) => o.treasureDisplay}
                optionValue={(o) => o.value}
              />
            )}
          </>
        )}

        {location.exteriorLocationId && (
          <>
            <div className="divider"></div>
            <Select
              label={"Distância"}
              extraWidth={250}
              value={location}
              valuePropertyPath="reference.distance"
              onSelect={setLocation}
              options={lc.referenceDistances}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Direção"}
              extraWidth={250}
              value={location}
              valuePropertyPath="reference.direction"
              onSelect={setLocation}
              options={lc.directions}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Localização"}
              extraWidth={250}
              value={location}
              valuePropertyPath="reference.location"
              onSelect={setLocation}
              options={[]}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <Select
              label={"Conectado Por"}
              extraWidth={250}
              value={location}
              valuePropertyPath="reference.connectionType"
              onSelect={setLocation}
              nothingSelected="Nada"
              options={lc.locationConnectionTypes}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
          </>
        )}
        <div className="divider"></div>

        <div className="location-detail-group">
          <div className="location-detail-group-title">
            <span>Contextos</span>
            <button onClick={() => OpenModalManageContext()}>
              <i class="fas fa-plus"></i>
            </button>
          </div>
          {location.contexts.map((c, index) => (
            <div className="location-detail-group-item" key={c.name}>
              <div className="df df-cg-10">
                <CheckInput isSelected={c.isCurrent} onClick={() => HandleSelectContext(c)} />
                <span>{c.name}</span>
              </div>
              <div className="group-item-actions">
                <button onClick={() => OpenModalManageContext(c)}>
                  <i className="fas fa-pencil-alt"></i>
                </button>
                <button onClick={() => DeleteContext(c)} disabled={index === 0}>
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="divider"></div>

        <div className="location-detail-group">
          <div className="location-detail-group-title">
            <span>Criaturas</span>
            <button onClick={() => HandleSelectCreatures()}>
              <i class="fas fa-plus"></i>
            </button>
          </div>
          {location.creatures.map((lc) => (
            <div className="location-detail-group-item" key={lc.creatureId}>
              <span>{creatures.find((c) => c._id === lc.creatureId).name}</span>
              <div className="group-item-actions">
                <button onClick={() => OpenModalManageCreature(lc)}>
                  <i className="fas fa-pencil-alt"></i>
                </button>
                <button onClick={() => DeleteCreature(lc)}>
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="action-buttons">
        {HandleDelete && (
          <button className="button-simple" onClick={OpenDeleteConfirmation}>
            Deletar
          </button>
        )}
        <div className="basic-actions">
          <button className="button-simple" onClick={FinishEditing}>
            Cancelar
          </button>
          <Button text="Salvar" onClick={HandleSaveLocation} isDisabled={!IsLocationValid()} />
        </div>
      </footer>
    </div>
  );
}

export default EditLocation;
