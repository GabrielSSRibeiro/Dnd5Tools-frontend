import React, { useState } from "react";
import * as lc from "../../../../../../constants/locationConstants";
import { creatureRarities, creatureEnvironments } from "../../../../../../constants/creatureConstants";

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

function EditLocation({ locationToEdit, HandleSave, HandleDelete, FinishEditing }) {
  const [location, setLocation] = useState(locationToEdit);
  const [modal, setModal] = useState(null);

  function IsLocationValid() {
    let isLocationValid = true;

    return isLocationValid;
  }

  function OpenDeleteConfirmation() {
    setModal(
      <ModalWarning
        title="Deletar Criatura"
        message="Tem certeza que deseja deletar essa criatura?"
        cancelText="Cancelar"
        onCancel={setModal}
        confirmText="Deletar"
        onConfirm={() => HandleDelete(location)}
      />
    );
  }

  function OpenModalManagePartition(partition) {
    setModal(<ModalManagePartition partition={partition} onClose={(tempPartition) => HandleCloseModalManagePartition(partition, tempPartition)} />);
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
    setModal(<ModalManageElement element={element} onClose={(tempElement) => HandleCloseModalManageElement(element, tempElement)} />);
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
    setModal(<ModalManageContext context={context} onClose={(tempContext) => HandleCloseModalManageContext(context, tempContext)} />);
  }
  function HandleCloseModalManageContext(context, tempContext) {
    if (tempContext) {
      if (context) {
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
    setModal(<ModalManageCreature creature={creature} onClose={(tempCreature) => HandleCloseModalManageCreature(creature, tempCreature)} />);
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

  return (
    <div className="EditLocation-container">
      {modal}
      <h3>Localização</h3>
      <main className="location-fields">
        <TextInput label="Nome" value={location} valuePropertyPath="name" onChange={setLocation} />

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

        <div className="divider"></div>

        {location.size ? (
          <>
            <Select
              label={"Tipo"}
              extraWidth={250}
              value={location}
              valuePropertyPath="type"
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
            <div className="location-detail-group">
              <span>Partições</span>
              <button onClick={() => OpenModalManagePartition()}>
                <i class="fas fa-plus"></i>
              </button>
            </div>
            {location.traversal.partitions.map((p) => (
              <div className="location-detail-group-item">
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
            <div className="location-detail-group">
              <span>Elementos</span>
              <button onClick={() => OpenModalManageElement()}>
                <i class="fas fa-plus"></i>
              </button>
            </div>
            {location.traversal.elements.map((e) => (
              <div className="location-detail-group-item">
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

        <div className="divider"></div>

        <div className="location-detail-group">
          <span>Contextos</span>
          <button onClick={() => OpenModalManageContext()}>
            <i class="fas fa-plus"></i>
          </button>
        </div>
        {location.contexts.map((c) => (
          <div className="location-detail-group-item">
            <span>{c.name}</span>
            <div className="group-item-actions">
              <button onClick={() => OpenModalManageContext(c)}>
                <i className="fas fa-pencil-alt"></i>
              </button>
              <button onClick={() => DeleteContext(c)}>
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}

        <div className="divider"></div>

        <div className="location-detail-group">
          <span>Criaturas</span>
          <button onClick={() => OpenModalManageCreature()}>
            <i class="fas fa-plus"></i>
          </button>
        </div>
        {location.creatures.map((c) => (
          <div className="location-detail-group-item">
            <span>{c.creatureId}</span>
            <div className="group-item-actions">
              <button onClick={() => OpenModalManageCreature(c)}>
                <i className="fas fa-pencil-alt"></i>
              </button>
              <button onClick={() => DeleteCreature(c)}>
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
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
          <Button text="Salvar" onClick={() => HandleSave(location)} isDisabled={!IsLocationValid()} />
        </div>
      </footer>
    </div>
  );
}

export default EditLocation;
