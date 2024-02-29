import React, { useState, useEffect } from "react";

import { creatureRarities } from "../../../../../../../../constants/creatureConstants";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as cc from "../../../../../../../../constants/creatureConstants";
import * as utils from "../../../../../../../../utils";

import Modal from "../../../../../../../../components/Modal";
import ModalManageCreatureRoutine from "../../../ModalManageCreatureRoutine";
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
  HandleSelectCreatures,
  SwapDungeonRoom,
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
          top: {
            connection: null,
            description: null,
          },
          bottom: {
            connection: null,
            description: null,
          },
          left: {
            connection: null,
            description: null,
          },
          right: {
            connection: null,
            description: null,
          },
          floor: {
            connection: null,
            description: null,
            direction: null,
          },
          ceiling: {
            connection: null,
            description: null,
            direction: null,
          },
          type: lc.ELEMENT_TYPES.STRUCTURE,
          isHazardous: false,
          rarity: null,
          creatures: [],
          currentCreatures: null,
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
        isPointOfInterest={true}
        isRoom={true}
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

  function OpenModalRoomDetails(property, title, placeholder) {
    setModal(
      <ModalTextArea
        title={title}
        text={tempRoom[property]}
        placeholder={placeholder}
        onClose={(tempTextArea) => HandleCloseModalRoomDetails(tempTextArea, property)}
      />
    );
  }
  function HandleCloseModalRoomDetails(tempTextArea, property) {
    if (tempTextArea != null) {
      tempRoom[property] = tempTextArea;
      setTempRoom({ ...tempRoom });
    }

    setModal(null);
  }

  function OpenModalRoomConnectionDetails(property) {
    setModal(
      <ModalTextArea
        title="Descriçao"
        text={tempRoom[property].description}
        placeholder="Descriçao da conexao"
        onClose={(tempTextArea) => HandleCloseModalRoomConnectionDetails(tempTextArea, property)}
      />
    );
  }
  function HandleCloseModalRoomConnectionDetails(tempTextArea, property) {
    if (tempTextArea != null) {
      tempRoom[property].description = tempTextArea;
      setTempRoom({ ...tempRoom });
    }

    setModal(null);
  }

  function HandleSelectType(newValue) {
    if (!canBeMaterial) {
      newValue.rarity = null;
    }

    setTempRoom(newValue);
  }

  function HandleSelectConnection(newValue, property) {
    if (!newValue[property].connection) {
      newValue[property].direction = null;
      newValue[property].description = null;
    }

    setTempRoom(newValue);
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
            <Select
              label={"Tamanho"}
              extraWidth={250}
              value={tempRoom}
              valuePropertyPath="size"
              onSelect={setTempRoom}
              options={lc.roomSizes}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />

            <div className="df df-cg-10 room-row">
              <Select
                label={"Cima ↑"}
                extraWidth={45}
                value={tempRoom}
                valuePropertyPath="top.connection"
                onSelect={(d) => HandleSelectConnection(d, "top")}
                options={lc.roomConnections}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                nothingSelected="Nenhuma"
              />
              <button
                title="Descriçao"
                className={`button-simple${!tempRoom.top.description ? " lacking-data" : ""}${!tempRoom.top.connection ? " element-disabled" : ""} `}
                onClick={() => OpenModalRoomConnectionDetails("top")}
                disabled={!tempRoom.top.connection}
              >
                <i className="fas fa-eye"></i>
              </button>
              <Select
                label={"Baixo ↓"}
                extraWidth={45}
                value={tempRoom}
                valuePropertyPath="bottom.connection"
                onSelect={(d) => HandleSelectConnection(d, "bottom")}
                options={lc.roomConnections}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                nothingSelected="Nenhuma"
              />
              <button
                title="Descriçao"
                className={`button-simple${!tempRoom.bottom.description ? " lacking-data" : ""}${
                  !tempRoom.bottom.connection ? " element-disabled" : ""
                } `}
                onClick={() => OpenModalRoomConnectionDetails("bottom")}
                disabled={!tempRoom.bottom.connection}
              >
                <i className="fas fa-eye"></i>
              </button>
            </div>
            <div className="df  df-cg-10 room-row">
              <Select
                label={"Esquerda ←"}
                extraWidth={45}
                value={tempRoom}
                valuePropertyPath="left.connection"
                onSelect={(d) => HandleSelectConnection(d, "left")}
                options={lc.roomConnections}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                nothingSelected="Nenhuma"
              />
              <button
                title="Descriçao"
                className={`button-simple${!tempRoom.left.description ? " lacking-data" : ""}${
                  !tempRoom.left.connection ? " element-disabled" : ""
                } `}
                onClick={() => OpenModalRoomConnectionDetails("left")}
                disabled={!tempRoom.left.connection}
              >
                <i className="fas fa-eye"></i>
              </button>
              <Select
                label={"Direita →"}
                extraWidth={45}
                value={tempRoom}
                valuePropertyPath="right.connection"
                onSelect={(d) => HandleSelectConnection(d, "right")}
                options={lc.roomConnections}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                nothingSelected="Nenhuma"
              />
              <button
                title="Descriçao"
                className={`button-simple${!tempRoom.right.description ? " lacking-data" : ""}${
                  !tempRoom.right.connection ? " element-disabled" : ""
                } `}
                onClick={() => OpenModalRoomConnectionDetails("right")}
                disabled={!tempRoom.right.connection}
              >
                <i className="fas fa-eye"></i>
              </button>
            </div>
            <Select
              label={"Altura"}
              extraWidth={250}
              value={tempRoom}
              valuePropertyPath="height"
              onSelect={setTempRoom}
              options={lc.roomHeights}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
            <div className="df df-cg-10 room-row">
              <Select
                label={"Piso"}
                extraWidth={40}
                value={tempRoom}
                valuePropertyPath="floor.connection"
                onSelect={(d) => HandleSelectConnection(d, "floor")}
                options={lc.roomConnections}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                nothingSelected="Nenhuma"
              />
              <Select
                label={"Direção conexão"}
                extraWidth={70}
                value={tempRoom}
                valuePropertyPath="floor.direction"
                onSelect={setTempRoom}
                options={lc.roomConnectionDirections.filter((d) => d.value !== tempRoom.ceiling.direction)}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                nothingSelected="Nenhuma"
                isDisabled={!tempRoom.floor.connection}
              />
              <button
                title="Descriçao"
                className={`button-simple${!tempRoom.floor.description ? " lacking-data" : ""}${
                  !tempRoom.floor.connection ? " element-disabled" : ""
                } `}
                onClick={() => OpenModalRoomConnectionDetails("floor")}
                disabled={!tempRoom.floor.connection}
              >
                <i className="fas fa-eye"></i>
              </button>
            </div>
            <div className="df df-cg-10 room-row">
              <Select
                label={"Teto"}
                extraWidth={40}
                value={tempRoom}
                valuePropertyPath="ceiling.connection"
                onSelect={(d) => HandleSelectConnection(d, "ceiling")}
                options={lc.roomConnections}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                nothingSelected="Nenhuma"
              />
              <Select
                label={"Direção conexão"}
                extraWidth={70}
                value={tempRoom}
                valuePropertyPath="ceiling.direction"
                onSelect={setTempRoom}
                options={lc.roomConnectionDirections.filter((d) => d.value !== tempRoom.floor.direction)}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                nothingSelected="Nenhuma"
                isDisabled={!tempRoom.ceiling.connection}
              />
              <button
                title="Descriçao"
                className={`button-simple${!tempRoom.ceiling.description ? " lacking-data" : ""}${
                  !tempRoom.ceiling.connection ? " element-disabled" : ""
                } `}
                onClick={() => OpenModalRoomConnectionDetails("ceiling")}
                disabled={!tempRoom.ceiling.connection}
              >
                <i className="fas fa-eye"></i>
              </button>
            </div>
          </>
        )}
        <div className="df df-ai-fs df-cg-15 room-row">
          <Select
            label={"Tipo"}
            extraWidth={50}
            value={tempRoom}
            valuePropertyPath="type"
            onSelect={HandleSelectType}
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

          {/* creatures */}
          {tempRoom.creatures.map((locC, cIndex) => {
            const name = creatures.find((c) => c._id === locC.creatureId).name;

            return (
              <div className="location-row location-detail-group-item df-fd-c location-creature" key={locC.creatureId}>
                <div className="group-item-actions">
                  <span>{name}</span>
                  <button onClick={() => OpenModalManageRoutine(locC)}>
                    <i className="fas fa-plus"></i>
                  </button>
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
                <>
                  <button title="Deletar" className="button-simple" onClick={DeleteDungeonRoom}>
                    <i className="fas fa-trash"></i>
                  </button>
                  <button title="Trocar" className="button-simple" onClick={SwapDungeonRoom}>
                    <i className="fas fa-retweet"></i>
                  </button>
                </>
              )}
              <button
                title="Primeiras Impressões"
                className={`button-simple${!tempRoom.firstImpressions ? " lacking-data" : ""}`}
                onClick={() =>
                  OpenModalRoomDetails(
                    "firstImpressions",
                    "Primeiras Impressões",
                    "O que quem se aproxima a primeira vez desse local experiencia. Algo entre o que sentem, o que veem, o que cheiram, o que ouvem..."
                  )
                }
              >
                <i className="fas fa-eye"></i>
              </button>
              <button title="Segredos" className="button-simple" onClick={() => OpenModalRoomDetails("secrets", "Segredos", "Segredos")}>
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
