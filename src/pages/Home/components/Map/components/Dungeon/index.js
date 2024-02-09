import React, { useState, useMemo, useRef } from "react";
import * as lc from "../../../../../../constants/locationConstants";
import { GetRarity } from "../../../../../../constants/creatureConstants";

import Info from "../../../../../../components/Info";
import ModalManageDungeonRoom from "./components/ModalManageDungeonRoom";

import "./styles.css";

function Dungeon({ location, setLocation, HandleSelectCreatures, creatures, roomSelect, currentRoomIndex = null }) {
  const [modal, setModal] = useState(null);
  const [roomToSwap, setRoomToSwap] = useState(null);
  const [roomToolTip, setRoomToolTip] = useState(null);

  const roomsPerRow = useRef(9);
  const rooms = useMemo(() => {
    let rooms = location.interaction.rooms;

    //if not edit and last row is empty, remove row
    const lastRows = rooms.slice(-roomsPerRow.current);
    if (roomSelect && lastRows.every((r) => !r)) {
      rooms.splice(rooms.length - roomsPerRow.current, roomsPerRow.current);
    }

    return rooms;
  }, [roomSelect, location.interaction.rooms]);

  function OpenModalManageDungeonRoom(room, index, isEntrance) {
    if (roomSelect) {
      roomSelect(index ?? -1);
      return;
    }

    if (roomToSwap != null) {
      [location.interaction.rooms[index], location.interaction.rooms[roomToSwap]] = [
        location.interaction.rooms[roomToSwap],
        location.interaction.rooms[index],
      ];
      setRoomToSwap(null);
      return;
    }

    const roomToManage = isEntrance
      ? {
          type: location.interaction.type,
          isHazardous: location.interaction.isHazardous,
          rarity: location.interaction.rarity,
          creatures: location.creatures,
        }
      : room;

    setModal(
      <ModalManageDungeonRoom
        title={isEntrance ? "Entrada" : "Sala"}
        info={[
          {
            text: "salas de masmorra ou pontos em vilas",
          },
        ]}
        room={roomToManage}
        isEntrance={isEntrance}
        contexts={location.contexts}
        creatures={creatures}
        HandleSelectCreatures={(creaturesObj, setter) => HandleSelectCreatures(creaturesObj, setter)}
        SwapDungeonRoom={() => SwapDungeonRoom(index)}
        DeleteDungeonRoom={() => DeleteDungeonRoom(index)}
        onClose={(tempRoom) => HandleCloseModalManageDungeonRoom(index, tempRoom, isEntrance)}
      />
    );
  }
  function HandleCloseModalManageDungeonRoom(index, tempRoom, isEntrance) {
    const addNewRow = () => {
      location.interaction.rooms.push(...Array(roomsPerRow.current));
      let scrollableElement = document.getElementById("EditLocation-scroll");
      setTimeout(() => {
        scrollableElement.scrollTop = scrollableElement.scrollHeight;
      }, 100);
    };

    if (tempRoom) {
      if (isEntrance) {
        location.interaction.type = tempRoom.type;
        location.interaction.isHazardous = tempRoom.isHazardous;
        location.interaction.rarity = tempRoom.rarity;
        location.creatures = tempRoom.creatures;
      } else {
        if (index != null) {
          location.interaction.rooms.splice(index, 1, tempRoom);

          //add new row if needed
          if (location.interaction.rooms.length < index + roomsPerRow.current) {
            addNewRow();
          }
        }
        //if empty
        else {
          addNewRow();
          location.interaction.rooms[Math.floor(roomsPerRow.current / 2)] = tempRoom;
          addNewRow();
        }
      }
    }

    setModal(null);
  }
  function SwapDungeonRoom(index) {
    setRoomToSwap(index);
    setModal(null);
  }
  function DeleteDungeonRoom(index) {
    location.interaction.rooms[index] = null;

    //if last of row, remove row
    const lastRows = location.interaction.rooms.slice(-roomsPerRow.current * 2);
    if (lastRows.every((r) => !r)) {
      location.interaction.rooms.splice(location.interaction.rooms.length - roomsPerRow.current, roomsPerRow.current);

      //if empty, clear
      if (location.interaction.rooms.every((r) => !r)) {
        location.interaction.rooms = [];
      }
    }

    setLocation({ ...location });
    setModal(null);
  }

  function CanBeNewRoom(i) {
    return !roomSelect;
    // const isLeftCorner = i % roomsPerRow.current === 0;
    // const isRightCorner = i !== 0 && i % (roomsPerRow.current - 1) === 0;

    // const topLeftIndex = i - roomsPerRow.current - 1;
    // const topLeft = location.interaction.rooms[topLeftIndex];
    // const hasValidTopLeft = topLeft && !isLeftCorner;

    // const toptIndex = i - roomsPerRow.current;
    // const top = location.interaction.rooms[toptIndex];
    // const hasValidTop = top;

    // const topRightIndex = i - roomsPerRow.current + 1;
    // const topRight = location.interaction.rooms[topRightIndex];
    // const hasValidTopRight = topRight && !isRightCorner;

    // const leftIndex = i - 1;
    // const left = location.interaction.rooms[leftIndex];
    // const hasValidLeft = left && !isLeftCorner;

    // const rightIndex = i + 1;
    // const right = location.interaction.rooms[rightIndex];
    // const hasValidRight = right && !isRightCorner;

    // const bottomLeftIndex = i + roomsPerRow.current - 1;
    // const bottomLeft = location.interaction.rooms[bottomLeftIndex];
    // const hasValidBottomLeft = bottomLeft && !isLeftCorner;

    // const bottomIndex = i + roomsPerRow.current;
    // const bottom = location.interaction.rooms[bottomIndex];
    // const hasValidBottom = bottom;

    // const bottomRightIndex = i + roomsPerRow.current + 1;
    // const bottomRight = location.interaction.rooms[bottomRightIndex];
    // const hasValidBottomRight = bottomRight && !isRightCorner;

    // return (
    //   hasValidTopLeft ||
    //   hasValidTop ||
    //   hasValidTopRight ||
    //   hasValidLeft ||
    //   hasValidRight ||
    //   hasValidBottomLeft ||
    //   hasValidBottom ||
    //   hasValidBottomRight
    // );
  }

  function GetRoomTooltip(purpose, roomCreatures, currentCreatures, room = null) {
    let roomTooltip = [];

    if (purpose) {
      roomTooltip.push({ text: `(${purpose})` });
    }

    if (room) {
      if (room.firstImpressions) {
        roomTooltip.push({ text: room.firstImpressions });
      }

      if (room.secrets) {
        roomTooltip.push({ text: "-------------------------------- Segredos" });
        roomTooltip.push({ text: room.secrets });
      }

      if (roomTooltip.length > 0) {
        roomTooltip.push({ text: "" });
      }

      const sizeInMeters = lc.GetRoomSize(room.size).meters;
      if (sizeInMeters) {
        roomTooltip.push({ text: `${sizeInMeters}m x ${sizeInMeters}m x ${lc.GetRoomHeight(room.height).metersDisplay} (altura)` });
      } else {
        roomTooltip.push({ text: `${lc.GetRoomHeight(room.height).metersDisplay} (altura)` });
      }

      roomTooltip.push({ text: `${lc.GetElementType(room.type).display}${room.isHazardous ? " (perigoso)" : ""}` });

      if (room.rarity) {
        roomTooltip.push({ text: `Material ${GetRarity(room.rarity).treasureDisplay}` });
      }
    }

    const roomCurrentCreatures = roomSelect ? currentCreatures : roomCreatures;
    if (roomCurrentCreatures.length > 0) {
      roomTooltip.push({ text: "" });
      roomCurrentCreatures.forEach((rc) => {
        roomTooltip.push({ text: `${creatures.find((c) => c._id === rc.creatureId)?.name}${roomSelect ? ` (x${rc.current})` : ""}` });
      });
    }

    return roomTooltip;
  }

  function GetRoomConnectionToolTip(room, roomObj, extraDescription = null) {
    let roomConnectionTooltip = [];

    if (roomObj.description) {
      roomConnectionTooltip.push({ text: `${roomObj.description}` });
      roomConnectionTooltip.push({ text: "" });
    }

    if (extraDescription) {
      roomConnectionTooltip.push({ text: `${extraDescription}` });
    } else {
      roomConnectionTooltip.push({ text: `${lc.GetRoomSize(room.size).corridorDisplay}` });
    }

    if (roomObj.connection === lc.ROOM_CONNECTIONS.BLOCKED) {
      roomConnectionTooltip.push({ text: `Bloqueado` });
    } else if (roomObj.connection === lc.ROOM_CONNECTIONS.UNBLOCKED) {
      roomConnectionTooltip.push({ text: `Desbloqueado` });
    }

    return roomConnectionTooltip;
  }

  function CanToggleCon(connection) {
    return connection === lc.ROOM_CONNECTIONS.BLOCKED || connection === lc.ROOM_CONNECTIONS.UNBLOCKED;
  }
  function ToggleBlock(connection, toggleFunc) {
    if (connection === lc.ROOM_CONNECTIONS.BLOCKED) {
      toggleFunc(lc.ROOM_CONNECTIONS.UNBLOCKED);
    } else if (connection === lc.ROOM_CONNECTIONS.UNBLOCKED) {
      toggleFunc(lc.ROOM_CONNECTIONS.BLOCKED);
    }

    setLocation({ ...location });
  }

  return (
    <div className={`Dungeon-container${!roomSelect ? "" : " exploration-container"}`}>
      {modal}
      {/* entrance */}
      <div className="location-row df dungeon-entrance">
        <button
          className={`df room${location.interaction.isHazardous ? " danger" : ""}${currentRoomIndex === -1 ? " selected-room" : ""}`}
          onClick={() => OpenModalManageDungeonRoom(null, null, true)}
          disabled={roomToSwap != null}
        >
          <Info
            className="dungeon-tooltip"
            contents={GetRoomTooltip("Entrada", location.creatures, location.interaction.currentCreatures)}
            tooltipOnly={true}
          />
          <div className="df entrance-contents">
            <i className={`fas fa-dungeon ${location.creatures.length > 0 ? "creatures" : ""}`}></i>
            {location.interaction.rarity && <i className={`fas fa-gem treasure`}></i>}
          </div>
        </button>
      </div>
      {/* rooms */}
      {(!roomSelect || rooms.length > 0) && (
        <div className="location-row df dungeon">
          {rooms.length > 0 ? (
            rooms.map((r, i) =>
              r ? (
                <div className="df room dungeon-room" key={i}>
                  {/* room connections */}
                  <Info className="dungeon-tooltip room-connection-tooltip" contents={roomToolTip} tooltipOnly={true}>
                    {/* horizontal */}
                    {(r.left.connection || r.right.connection) && (
                      <div className="df room-connection horizontal">
                        {r.left.connection && (
                          <div
                            className={`first-piece${CanToggleCon(r.left.connection) ? "" : " regular-corridor"}`}
                            onClick={() =>
                              ToggleBlock(r.left.connection, (c) => {
                                r.left.connection = c;
                              })
                            }
                            onMouseMove={(e) => setRoomToolTip(GetRoomConnectionToolTip(r, r.left))}
                            onMouseLeave={(e) => setRoomToolTip(null)}
                          ></div>
                        )}
                        {r.right.connection && (
                          <div
                            className={`last-piece${CanToggleCon(r.right.connection) ? "" : " regular-corridor"}`}
                            onClick={() =>
                              ToggleBlock(r.right.connection, (c) => {
                                r.right.connection = c;
                              })
                            }
                            onMouseMove={(e) => setRoomToolTip(GetRoomConnectionToolTip(r, r.right))}
                            onMouseLeave={(e) => setRoomToolTip(null)}
                          ></div>
                        )}
                      </div>
                    )}

                    {/* vertical */}
                    {(r.top.connection || r.bottom.connection) && (
                      <div className="df room-connection vertical">
                        {r.top.connection && (
                          <div
                            className={`first-piece${CanToggleCon(r.top.connection) ? "" : " regular-corridor"}`}
                            onClick={() =>
                              ToggleBlock(r.top.connection, (c) => {
                                r.top.connection = c;
                              })
                            }
                            onMouseMove={(e) => setRoomToolTip(GetRoomConnectionToolTip(r, r.top))}
                            onMouseLeave={(e) => setRoomToolTip(null)}
                          ></div>
                        )}
                        {r.bottom.connection && (
                          <div
                            className={`last-piece${CanToggleCon(r.bottom.connection) ? "" : " regular-corridor"}`}
                            onClick={() =>
                              ToggleBlock(r.bottom.connection, (c) => {
                                r.bottom.connection = c;
                              })
                            }
                            onMouseMove={(e) => setRoomToolTip(GetRoomConnectionToolTip(r, r.bottom))}
                            onMouseLeave={(e) => setRoomToolTip(null)}
                          ></div>
                        )}
                      </div>
                    )}

                    {/* main-diagonal */}
                    {[r.floor.direction, r.ceiling.direction].some((d) =>
                      [lc.ROOM_CONNECTION_DIRECTIONS.TOP_LEFT, lc.ROOM_CONNECTION_DIRECTIONS.BOTTOM_RIGHT].includes(d)
                    ) && (
                      <div className="df room-connection main-diagonal">
                        {/* top left */}
                        {[r.floor.direction, r.ceiling.direction].includes(lc.ROOM_CONNECTION_DIRECTIONS.TOP_LEFT) &&
                          (r.floor.direction === lc.ROOM_CONNECTION_DIRECTIONS.TOP_LEFT ? (
                            <div
                              className={`first-piece floor${CanToggleCon(r.floor.connection) ? "" : " regular-corridor"}`}
                              onClick={() =>
                                ToggleBlock(r.floor.connection, (c) => {
                                  r.floor.connection = c;
                                })
                              }
                              onMouseMove={(e) => setRoomToolTip(GetRoomConnectionToolTip(r, r.floor, "descida (piso)"))}
                              onMouseLeave={(e) => setRoomToolTip(null)}
                            ></div>
                          ) : (
                            <div
                              className={`first-piece ceiling${CanToggleCon(r.ceiling.connection) ? "" : " regular-corridor"}`}
                              onClick={() =>
                                ToggleBlock(r.ceiling.connection, (c) => {
                                  r.ceiling.connection = c;
                                })
                              }
                              onMouseMove={(e) => setRoomToolTip(GetRoomConnectionToolTip(r, r.ceiling, "subida (teto)"))}
                              onMouseLeave={(e) => setRoomToolTip(null)}
                            ></div>
                          ))}

                        {/* bottom right */}
                        {[r.floor.direction, r.ceiling.direction].includes(lc.ROOM_CONNECTION_DIRECTIONS.BOTTOM_RIGHT) &&
                          (r.floor.direction === lc.ROOM_CONNECTION_DIRECTIONS.BOTTOM_RIGHT ? (
                            <div
                              className={`last-piece floor${CanToggleCon(r.floor.connection) ? "" : " regular-corridor"}`}
                              onClick={() =>
                                ToggleBlock(r.floor.connection, (c) => {
                                  r.floor.connection = c;
                                })
                              }
                              onMouseMove={(e) => setRoomToolTip(GetRoomConnectionToolTip(r, r.floor, "descida (piso)"))}
                              onMouseLeave={(e) => setRoomToolTip(null)}
                            ></div>
                          ) : (
                            <div
                              className={`last-piece ceiling${CanToggleCon(r.ceiling.connection) ? "" : " regular-corridor"}`}
                              onClick={() =>
                                ToggleBlock(r.ceiling.connection, (c) => {
                                  r.ceiling.connection = c;
                                })
                              }
                              onMouseMove={(e) => setRoomToolTip(GetRoomConnectionToolTip(r, r.ceiling, "subida (teto)"))}
                              onMouseLeave={(e) => setRoomToolTip(null)}
                            ></div>
                          ))}
                      </div>
                    )}

                    {/* diagonal */}
                    {[r.floor.direction, r.ceiling.direction].some((d) =>
                      [lc.ROOM_CONNECTION_DIRECTIONS.BOTTOM_LEFT, lc.ROOM_CONNECTION_DIRECTIONS.TOP_RIGHT].includes(d)
                    ) && (
                      <div className="df room-connection diagonal">
                        {/* bottom left */}
                        {[r.floor.direction, r.ceiling.direction].includes(lc.ROOM_CONNECTION_DIRECTIONS.BOTTOM_LEFT) &&
                          (r.floor.direction === lc.ROOM_CONNECTION_DIRECTIONS.BOTTOM_LEFT ? (
                            <div
                              className={`first-piece floor${CanToggleCon(r.floor.connection) ? "" : " regular-corridor"}`}
                              onClick={() =>
                                ToggleBlock(r.floor.connection, (c) => {
                                  r.floor.connection = c;
                                })
                              }
                              onMouseMove={(e) => setRoomToolTip(GetRoomConnectionToolTip(r, r.floor, "descida (piso)"))}
                              onMouseLeave={(e) => setRoomToolTip(null)}
                            ></div>
                          ) : (
                            <div
                              className={`first-piece ceiling${CanToggleCon(r.ceiling.connection) ? "" : " regular-corridor"}`}
                              onClick={() =>
                                ToggleBlock(r.ceiling.connection, (c) => {
                                  r.ceiling.connection = c;
                                })
                              }
                              onMouseMove={(e) => setRoomToolTip(GetRoomConnectionToolTip(r, r.ceiling, "subida (teto)"))}
                              onMouseLeave={(e) => setRoomToolTip(null)}
                            ></div>
                          ))}

                        {/* top right */}
                        {[r.floor.direction, r.ceiling.direction].includes(lc.ROOM_CONNECTION_DIRECTIONS.TOP_RIGHT) &&
                          (r.floor.direction === lc.ROOM_CONNECTION_DIRECTIONS.TOP_RIGHT ? (
                            <div
                              className={`last-piece floor${CanToggleCon(r.floor.connection) ? "" : " regular-corridor"}`}
                              onClick={() =>
                                ToggleBlock(r.floor.connection, (c) => {
                                  r.floor.connection = c;
                                })
                              }
                              onMouseMove={(e) => setRoomToolTip(GetRoomConnectionToolTip(r, r.floor, "descida (piso)"))}
                              onMouseLeave={(e) => setRoomToolTip(null)}
                            ></div>
                          ) : (
                            <div
                              className={`last-piece ceiling${CanToggleCon(r.ceiling.connection) ? "" : " regular-corridor"}`}
                              onClick={() =>
                                ToggleBlock(r.ceiling.connection, (c) => {
                                  r.ceiling.connection = c;
                                })
                              }
                              onMouseMove={(e) => setRoomToolTip(GetRoomConnectionToolTip(r, r.ceiling, "subida (teto)"))}
                              onMouseLeave={(e) => setRoomToolTip(null)}
                            ></div>
                          ))}
                      </div>
                    )}
                  </Info>

                  {/* room area */}
                  <button
                    className={`df room-area ${lc.GetRoomSize(r.size).cssClass}${r.isHazardous ? " danger" : ""}${
                      currentRoomIndex === i ? " selected-room" : ""
                    }${roomToSwap != null ? " is-swapping-room" : ""}`}
                    onClick={() => OpenModalManageDungeonRoom(r, i)}
                    onMouseMove={(e) => setRoomToolTip(GetRoomTooltip(r.purpose, r.creatures, r.currentCreatures, r))}
                    onMouseLeave={(e) => setRoomToolTip(null)}
                  >
                    <Info className="dungeon-tooltip room-tooltip" contents={roomToolTip} tooltipOnly={true} />

                    {/* connection bases */}
                    {[r.floor.direction, r.ceiling.direction].includes(lc.ROOM_CONNECTION_DIRECTIONS.TOP_LEFT) && (
                      <div
                        className={`connection-base top-left ${
                          r.floor.direction === lc.ROOM_CONNECTION_DIRECTIONS.TOP_LEFT
                            ? r.floor.connection === lc.ROOM_CONNECTIONS.BLOCKED
                              ? "blocked-connection"
                              : r.floor.connection === lc.ROOM_CONNECTIONS.UNBLOCKED
                              ? "unblocked-connection"
                              : "floor"
                            : r.ceiling.connection === lc.ROOM_CONNECTIONS.BLOCKED
                            ? "blocked-connection"
                            : r.ceiling.connection === lc.ROOM_CONNECTIONS.UNBLOCKED
                            ? "unblocked-connection"
                            : "ceiling"
                        }`}
                      ></div>
                    )}
                    {r.top.connection && (
                      <div
                        className={`connection-base top${
                          r.top.connection === lc.ROOM_CONNECTIONS.BLOCKED
                            ? " blocked-connection"
                            : r.top.connection === lc.ROOM_CONNECTIONS.UNBLOCKED
                            ? " unblocked-connection"
                            : ""
                        }`}
                      ></div>
                    )}
                    {[r.floor.direction, r.ceiling.direction].includes(lc.ROOM_CONNECTION_DIRECTIONS.TOP_RIGHT) && (
                      <div
                        className={`connection-base top-right ${
                          r.floor.direction === lc.ROOM_CONNECTION_DIRECTIONS.TOP_RIGHT
                            ? r.floor.connection === lc.ROOM_CONNECTIONS.BLOCKED
                              ? "blocked-connection"
                              : r.floor.connection === lc.ROOM_CONNECTIONS.UNBLOCKED
                              ? "unblocked-connection"
                              : "floor"
                            : r.ceiling.connection === lc.ROOM_CONNECTIONS.BLOCKED
                            ? "blocked-connection"
                            : r.ceiling.connection === lc.ROOM_CONNECTIONS.UNBLOCKED
                            ? "unblocked-connection"
                            : "ceiling"
                        }`}
                      ></div>
                    )}

                    {r.left.connection && (
                      <div
                        className={`connection-base left${
                          r.left.connection === lc.ROOM_CONNECTIONS.BLOCKED
                            ? " blocked-connection"
                            : r.left.connection === lc.ROOM_CONNECTIONS.UNBLOCKED
                            ? " unblocked-connection"
                            : ""
                        }`}
                      ></div>
                    )}
                    {r.right.connection && (
                      <div
                        className={`connection-base right${
                          r.right.connection === lc.ROOM_CONNECTIONS.BLOCKED
                            ? " blocked-connection"
                            : r.right.connection === lc.ROOM_CONNECTIONS.UNBLOCKED
                            ? " unblocked-connection"
                            : ""
                        }`}
                      ></div>
                    )}

                    {[r.floor.direction, r.ceiling.direction].includes(lc.ROOM_CONNECTION_DIRECTIONS.BOTTOM_LEFT) && (
                      <div
                        className={`connection-base bottom-left ${
                          r.floor.direction === lc.ROOM_CONNECTION_DIRECTIONS.BOTTOM_LEFT
                            ? r.floor.connection === lc.ROOM_CONNECTIONS.BLOCKED
                              ? "blocked-connection"
                              : r.floor.connection === lc.ROOM_CONNECTIONS.UNBLOCKED
                              ? "unblocked-connection"
                              : "floor"
                            : r.ceiling.connection === lc.ROOM_CONNECTIONS.BLOCKED
                            ? "blocked-connection"
                            : r.ceiling.connection === lc.ROOM_CONNECTIONS.UNBLOCKED
                            ? "unblocked-connection"
                            : "ceiling"
                        }`}
                      ></div>
                    )}
                    {r.bottom.connection && (
                      <div
                        className={`connection-base bottom${
                          r.bottom.connection === lc.ROOM_CONNECTIONS.BLOCKED
                            ? " blocked-connection"
                            : r.bottom.connection === lc.ROOM_CONNECTIONS.UNBLOCKED
                            ? " unblocked-connection"
                            : ""
                        }`}
                      ></div>
                    )}
                    {[r.floor.direction, r.ceiling.direction].includes(lc.ROOM_CONNECTION_DIRECTIONS.BOTTOM_RIGHT) && (
                      <div
                        className={`connection-base bottom-right ${
                          r.floor.direction === lc.ROOM_CONNECTION_DIRECTIONS.BOTTOM_RIGHT
                            ? r.floor.connection === lc.ROOM_CONNECTIONS.BLOCKED
                              ? "blocked-connection"
                              : r.floor.connection === lc.ROOM_CONNECTIONS.UNBLOCKED
                              ? "unblocked-connection"
                              : "floor"
                            : r.ceiling.connection === lc.ROOM_CONNECTIONS.BLOCKED
                            ? "blocked-connection"
                            : r.ceiling.connection === lc.ROOM_CONNECTIONS.UNBLOCKED
                            ? "unblocked-connection"
                            : "ceiling"
                        }`}
                      ></div>
                    )}

                    {(r.rarity || r.creatures.length > 0) && (
                      <div className="df room-content">
                        {r.creatures.length > 0 ? (
                          <i className={`fas fa-skull ${r.rarity ? "treasure" : "creatures"}`}></i>
                        ) : (
                          <i className="fas fa-gem treasure"></i>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              ) : (
                <div className={`dungeon-room${CanBeNewRoom(i) ? "" : " invisible"}`} onClick={() => OpenModalManageDungeonRoom(r, i)} key={i}>
                  <button className={`df dungeon-room${roomToSwap != null ? " is-swapping-room" : ""}`}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              )
            )
          ) : (
            <button className="df dungeon-room" onClick={() => OpenModalManageDungeonRoom()}>
              <i className="fas fa-plus"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Dungeon;
