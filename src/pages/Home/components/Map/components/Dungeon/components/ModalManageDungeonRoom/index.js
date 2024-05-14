import React, { useState, useEffect } from "react";

import { creatureRarities } from "../../../../../../../../constants/creatureConstants";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as cc from "../../../../../../../../constants/creatureConstants";
import * as utils from "../../../../../../../../utils";

import Modal from "../../../../../../../../components/Modal";
import ModalTextArea from "../../../../../../../../components/ModalTextArea";
import Button from "../../../../../../../../components/Button";
import Select from "../../../../../../../../components/Select";
import CheckInput from "../../../../../../../../components/CheckInput";
import TextInput from "../../../../../../../../components/TextInput";
import CreatureManager from "../../../CreatureManager";

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
          boundCreatures: [],
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
                extraWidth={75}
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
                label="(cima)"
                preDisplay="↑"
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
                label="(baixo)"
                preDisplay="↓"
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
                label="(esquerda)"
                preDisplay="←"
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
                label="(direita)"
                preDisplay="→"
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
                extraWidth={75}
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
        <Select
          label={"Altura"}
          extraWidth={250}
          value={tempRoom}
          valuePropertyPath="height"
          nothingSelected="-"
          onSelect={setTempRoom}
          options={lc.roomHeights}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <div className="df df-ai-fs df-cg-15 room-row">
          <Select
            label={"Tipo"}
            extraWidth={105}
            value={tempRoom}
            valuePropertyPath="type"
            onSelect={HandleSelectType}
            options={lc.elementTypes}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
          />
          <CheckInput
            label="Perigoso"
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

        {/* creatures */}
        <CreatureManager
          data={tempRoom}
          setData={setTempRoom}
          contexts={contexts}
          creatures={creatures}
          HandleSelectCreatures={HandleSelectCreatures}
          isPointOfInterest={true}
        />
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
