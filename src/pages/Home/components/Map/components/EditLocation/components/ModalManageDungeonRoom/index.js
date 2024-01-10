import React, { useState, useEffect } from "react";

import { creatureRarities } from "../../../../../../../../constants/creatureConstants";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as cc from "../../../../../../../../constants/creatureConstants";
import * as utils from "../../../../../../../../utils";

import Modal from "../../../../../../../../components/Modal";
import ModalManageCreatureRoutine from "../ModalManageCreatureRoutine";
import ModalTextArea from "../../../../../../../../components/ModalTextArea";
import Button from "../../../../../../../../components/Button";
import Select from "../../../../../../../../components/Select";
import CheckInput from "../../../../../../../../components/CheckInput";
import TextInput from "../../../../../../../../components/TextInput";

import "./styles.css";

function ModalManageDungeonRoom({
  title,
  info,
  room,
  isEntrance,
  contexts,
  creatures,
  isPointOfInterest,
  HandleSelectCreatures,
  DeleteDungeonRoom,
  onClose,
}) {
  const [tempRoom, setTempRoom] = useState(
    room
      ? utils.clone(room)
      : {
          purpose: null,
          firstImpressions: null,
          secrets: null,
          size: lc.ROOM_SIZES.MEDIUM,
          height: lc.ROOM_HEIGHTS.MEDIUM,
          top: lc.ROOM_CONNECTIONS.NONE,
          bottom: lc.ROOM_CONNECTIONS.NONE,
          left: lc.ROOM_CONNECTIONS.NONE,
          right: lc.ROOM_CONNECTIONS.NONE,
          floor: lc.ROOM_CONNECTIONS.NONE,
          ceiling: lc.ROOM_CONNECTIONS.NONE,
          type: lc.ELEMENT_TYPES.STRUCTURE,
          isHazardous: false,
          rarity: null,
          creatures: [],
        }
  );
  const [canBeMaterial, setCanBeMaterial] = useState(false);
  const [modal, setModal] = useState(false);

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempRoom);
  }

  function OpenModalManageRoutine(creature, routine) {
    setModal(
      <ModalManageCreatureRoutine
        routine={routine}
        contexts={contexts.map((c) => c.name)}
        isPointOfInterest={isPointOfInterest}
        onClose={(tempRoutine) => HandleCloseModalManageRoutine(creature, routine, tempRoutine)}
      />
    );
  }
  function HandleCloseModalManageRoutine(creature, routine, tempRoutine) {
    if (tempRoutine) {
      if (routine) {
        let index = creature.routines.findIndex((r) => r.encounterFrequency === routine.encounterFrequency);
        creature.routines.splice(index, 1, tempRoutine);
      } else {
        creature.routines.push(tempRoutine);
      }
    }

    setModal(null);
  }
  function DeleteRoutine(creature, cIndex, routine) {
    creature.routines = creature.routines.filter((r) => r.encounterFrequency !== routine.encounterFrequency);
    tempRoom.creatures[cIndex] = creature;
    setTempRoom({ ...tempRoom, creatures: tempRoom.creatures });
  }

  function OpenModalDetails(property, title, placeholder) {
    setModal(
      <ModalTextArea
        title={title}
        text={tempRoom[property]}
        placeholder={placeholder}
        onClose={(tempTextArea) => HandleCloseModalTextArea(tempTextArea, property)}
      />
    );
  }
  function HandleCloseModalTextArea(tempTextArea, property) {
    if (tempTextArea != null) {
      tempRoom[property] = tempTextArea;
      setTempRoom({ ...tempRoom });
    }

    setModal(null);
  }

  function CheckFinalButtonValid() {
    if (!tempRoom.type) {
      return false;
    }

    return true;
  }

  useEffect(() => {
    if (lc.GetElementType(tempRoom.type)?.canBeMaterial) {
      setCanBeMaterial(true);
    } else {
      tempRoom.material = {
        probability: null,
        rarity: cc.CREATURE_RARITIES.COMMON,
      };
      setCanBeMaterial(false);
    }
  }, [tempRoom, tempRoom.type]);

  return (
    <Modal title={title} className="ModalManageDungeonRoom-container" onClickToClose={onClose} info={info}>
      {modal}
      <div className="new-room-wrapper">
        {!isEntrance && (
          <>
            <TextInput label="Propósito" value={tempRoom} valuePropertyPath="purpose" onChange={setTempRoom} />
            <div className="df df-ai-fs df-cg-10 room-row">
              <Select
                label={"Tamanho"}
                extraWidth={70}
                value={tempRoom}
                valuePropertyPath="size"
                onSelect={setTempRoom}
                options={lc.roomSizes}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
              <Select
                label={"Altura"}
                extraWidth={70}
                value={tempRoom}
                valuePropertyPath="height"
                onSelect={setTempRoom}
                options={lc.roomHeights}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
            </div>
            <div className="df df-ai-fs df-cg-10 room-row">
              <Select
                label={"Frente"}
                extraWidth={70}
                value={tempRoom}
                valuePropertyPath="top"
                onSelect={setTempRoom}
                options={lc.roomConnections}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
              <Select
                label={"Atrás"}
                extraWidth={70}
                value={tempRoom}
                valuePropertyPath="bottom"
                onSelect={setTempRoom}
                options={lc.roomConnections}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
            </div>
            <div className="df df-ai-fs df-cg-10 room-row">
              <Select
                label={"Esquerda"}
                extraWidth={70}
                value={tempRoom}
                valuePropertyPath="left"
                onSelect={setTempRoom}
                options={lc.roomConnections}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
              <Select
                label={"Direita"}
                extraWidth={70}
                value={tempRoom}
                valuePropertyPath="right"
                onSelect={setTempRoom}
                options={lc.roomConnections}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
            </div>
            <div className="df df-ai-fs df-cg-10 room-row">
              <Select
                label={"Piso"}
                extraWidth={70}
                value={tempRoom}
                valuePropertyPath="floor"
                onSelect={setTempRoom}
                options={lc.roomConnections}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
              <Select
                label={"Teto"}
                extraWidth={70}
                value={tempRoom}
                valuePropertyPath="ceiling"
                onSelect={setTempRoom}
                options={lc.roomConnections}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
            </div>
          </>
        )}
        <div className="df df-ai-fs df-cg-15 room-row">
          <Select
            label={"Tipo"}
            extraWidth={50}
            value={tempRoom}
            valuePropertyPath="type"
            onSelect={setTempRoom}
            options={lc.elementTypes}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
          />
          <CheckInput
            label="Toque Perigoso"
            info={[{ text: "Ravinas profundas, lagos poluidos, estruturas desmoronantes, rochas afiadas, plantas venenosas, objetos armadilhas" }]}
            onClick={() => setTempRoom({ ...tempRoom, isHazardous: !tempRoom.isHazardous })}
            isSelected={tempRoom.isHazardous}
            className="interaction"
          />
        </div>
        {canBeMaterial && (
          <Select
            label={"Raridade de Material"}
            extraWidth={250}
            value={tempRoom}
            valuePropertyPath="rarity"
            onSelect={setTempRoom}
            nothingSelected="Nenhuma"
            options={creatureRarities}
            optionDisplay={(o) => o.treasureDisplay}
            optionValue={(o) => o.value}
          />
        )}

        <div className="location-detail-group">
          <div className="location-row location-detail-group-title">
            <span className={tempRoom.creatures.length === 0 ? `lacking-data` : ""}>Criaturas</span>
            <button onClick={() => HandleSelectCreatures(tempRoom, setTempRoom)}>
              <i className="fas fa-retweet"></i>
            </button>
          </div>
          {tempRoom.creatures.map((locC, cIndex) => {
            const name = creatures.find((c) => c._id === locC.creatureId).name;

            return (
              <div className="location-row location-detail-group-item df-fd-c location-creature" key={locC.creatureId}>
                <div className="group-item-actions">
                  <span>{name}</span>
                  <button onClick={() => OpenModalManageRoutine(locC)}>
                    <i className="fas fa-plus"></i>
                  </button>
                  {/* <button onClick={() => OpenModalManageCreature(lc, name)}>
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                  <button onClick={() => DeleteCreature(lc)}>
                    <i className="fas fa-trash"></i>
                  </button> */}
                </div>
                {locC.routines.map((r, rIndex) => {
                  const rContextIndex = contexts.findIndex((c) => c.name === r.context);

                  return (
                    <div className="routine df df-jc-sb df-cg-5" key={r.encounterFrequency + rIndex}>
                      <span>
                        {lc.GetGroupSize(r.groupSize).routineDisplay} <i className="fas fa-dragon"></i>
                      </span>
                      <div className="df df-cg-5">
                        {rContextIndex >= 0 && <span>{rContextIndex + 1}.</span>}
                        {r.schedule && (
                          <span>
                            <i className={lc.GetRoutineSchedule(r.schedule).icon}></i>
                          </span>
                        )}
                        {r.precipitation && (
                          <span>
                            <i className={lc.GetRoutinePrecipitation(r.precipitation).icon}></i>
                          </span>
                        )}
                        {r.temperature && (
                          <span>
                            <i className={lc.GetRoutineTemperature(r.temperature).icon}></i>
                          </span>
                        )}
                        <span>{utils.turnValueIntoPercentageString(lc.GetEncounterFrequency(r.encounterFrequency).probability)}</span>
                        <div className="group-item-actions">
                          <button onClick={() => OpenModalManageRoutine(locC, r)}>
                            <i className="fas fa-pencil-alt"></i>
                          </button>
                          <button onClick={() => DeleteRoutine(locC, cIndex, r)} disabled={locC.routines.length === 1}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <footer className="df df-jc-sb">
        <div className="df df-jc-sb df-cg-15">
          {!isEntrance && (
            <>
              {room && (
                <button title="Deletar" className="button-simple" onClick={DeleteDungeonRoom}>
                  <i className="fas fa-trash"></i>
                </button>
              )}
              <button
                title="Primeiras Impressões"
                className={`button-simple${!tempRoom.firstImpressions ? " lacking-data" : ""}`}
                onClick={() =>
                  OpenModalDetails(
                    "firstImpressions",
                    "Primeiras Impressões",
                    "O que quem se aproxima a primeira vez desse local experiencia. Algo entre o que sentem, o que veem, o que cheiram, o que ouvem..."
                  )
                }
              >
                <i className="fas fa-eye"></i>
              </button>
              <button title="Segredos" className="button-simple" onClick={() => OpenModalDetails("secrets", "Segredos", "Segredos")}>
                <i className="fas fa-mask"></i>
              </button>
            </>
          )}
        </div>
        <div className="df df-jc-sb df-cg-15">
          <button className="button-simple" onClick={HandleCancel}>
            Cancelar
          </button>
          <Button text="Salvar" onClick={HandleConfirm} isDisabled={!CheckFinalButtonValid()} />
        </div>
      </footer>
    </Modal>
  );
}

export default ModalManageDungeonRoom;
