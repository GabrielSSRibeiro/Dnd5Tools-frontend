import React, { useState, useMemo, useRef } from "react";
import * as utils from "../../../../../../utils";
import * as lc from "../../../../../../constants/locationConstants";
import { creatureRarities, creatureEnvironments } from "../../../../../../constants/creatureConstants";
import * as lh from "../../../../../../helpers/locationHelper";

import Button from "../../../../../../components/Button";
import TextInput from "../../../../../../components/TextInput";
import Select from "../../../../../../components/Select";
import CheckInput from "../../../../../../components/CheckInput";
import ModalDeleteLocation from "./components/ModalDeleteLocation";
import ModalMoveLocation from "./components/ModalMoveLocation";
// import ModalManagePartition from "./components/ModalManagePartition";
import ModalManageElement from "./components/ModalManageElement";
import ModalManageContext from "./components/ModalManageContext";
import ModalManageCreature from "./components/ModalManageCreature";

import "./styles.css";

function EditLocation({
  locationToEdit,
  HandleSave,
  HandleMove,
  HandleDelete,
  FinishEditing,
  HandleSelectFromBestiary,
  setSelectedCreatures,
  creatures,
  locations,
  world,
  map,
}) {
  let inputRef = useRef(null);
  const [location, setLocation] = useState(locationToEdit);
  const [modal, setModal] = useState(null);

  const locationSizes = useMemo(() => {
    let locationSizes = lc.locationSizes;

    if (map[location._id] && Object.values(map[location._id].interiorLocs).length > 0) {
      locationSizes = locationSizes.filter((ls) => ls.value !== lc.LOCATION_SIZES.POINT_OF_INTEREST);
    }

    return locationSizes;
  }, [location._id, map]);
  const referenceLocations = useMemo(() => {
    let refLocations = [];

    locations
      .filter((l) => l._id !== location._id && l.exteriorLocationId === location.exteriorLocationId && !l.isHidden)
      .forEach((rl) => {
        const interiorLocs = Object.values(map[rl._id].interiorLocs);
        if (interiorLocs.length > 0) {
          rl.refListName = interiorLocs.find((il) => !il.data.reference.location && !il.isHidden).data.name;
        } else {
          rl.refListName = rl.name;
        }

        refLocations.push(rl);
      });

    return refLocations;
  }, [location._id, location.exteriorLocationId, locations, map]);
  const isWorld = useMemo(() => !location.exteriorLocationId, [location]);
  const isPointOfInterest = useMemo(() => location.size === lc.LOCATION_SIZES.POINT_OF_INTEREST, [location]);
  const isFirstOfArea = useMemo(
    //if there is no option or there isn't any loc that doesn't have a ref loc
    () => referenceLocations.length === 0 || !referenceLocations.some((l) => !l.reference.location),
    [referenceLocations]
  );

  function HandleSaveLocation() {
    //if ref is possible, but not selected, flag as hidden loc
    location.isHidden = !isWorld && !isFirstOfArea && !location.reference.distance && !location.reference.direction && !location.reference.location;

    //if a loc is no longer a PoI, update any certain creature routine to extreme
    if (!isPointOfInterest) {
      let creaturesToFix = location.creatures.filter((c) => c.routines.some((r) => r.encounterFrequency === lc.ENCOUNTER_FREQUENCIES.CERTAIN));
      creaturesToFix.forEach((c) => {
        c.routines
          .filter((r) => r.encounterFrequency === lc.ENCOUNTER_FREQUENCIES.CERTAIN)
          .forEach((r) => {
            r.encounterFrequency = lc.ENCOUNTER_FREQUENCIES.EXTREME;
          });
      });
    }

    HandleSave(location);
  }

  function OpenModalDeleteLocation() {
    setModal(
      <ModalDeleteLocation
        title="Deletar Localização"
        message="Tem certeza que deseja deletar essa localização?"
        cancelText="Cancelar"
        onCancel={setModal}
        confirmText="Deletar"
        onConfirm={(deleteInteriorLocs) => HandleDelete(location, deleteInteriorLocs)}
      />
    );
  }

  function OpenModalMoveLocation() {
    function IsLocInteriorTo(location, possibleExteriorLocId) {
      if (location.exteriorLocationId === possibleExteriorLocId) {
        return true;
      } else if (!map[location.exteriorLocationId]) {
        return false;
      } else {
        return IsLocInteriorTo(map[location.exteriorLocationId].data, possibleExteriorLocId);
      }
    }

    //list should be only locs that are not point of interest, this exterior, this loc, or interior to this one
    let validLocs = locations.filter(
      (l) =>
        l.size !== lc.LOCATION_SIZES.POINT_OF_INTEREST &&
        l._id !== location._id &&
        l._id !== location.exteriorLocationId &&
        !IsLocInteriorTo(l, location._id)
    );

    setModal(
      <ModalMoveLocation
        world={map[location.exteriorLocationId] ? world : null}
        locations={validLocs}
        onClose={setModal}
        onSelect={(newExteriorLocId, moveInteriorLocs) => HandleMove(locationToEdit, newExteriorLocId, moveInteriorLocs)}
      />
    );
  }

  function HandleSelectSize(updatedValue) {
    location.radiusMultiplier = lh.GetRadiusMultiplier(updatedValue.size);
    setLocation({ ...location });
  }

  function HandleSelectRefDistance(updatedValue) {
    location.distanceMultiplier = updatedValue.reference.distance ? lh.GetDistanceMultiplier(updatedValue.reference.distance) : null;

    setLocation({ ...location });
  }

  function HandleSelectRefDirection(updatedValue) {
    location.distanceAngle = updatedValue.reference.direction ? lh.GetDistanceAngle(updatedValue.reference.direction) : null;

    setLocation({ ...location });
  }

  function HandleSelectContext(context) {
    location.contexts.forEach((c) => {
      c.isCurrent = c.name === context.name && !c.isCurrent;
    });
    setLocation({ ...location });
  }

  // function OpenModalManagePartition(partition) {
  //   setModal(
  //     <ModalManagePartition
  //       partition={partition}
  //       partitions={location.traversal.partitions}
  //       onClose={(tempPartition) => HandleCloseModalManagePartition(partition, tempPartition)}
  //     />
  //   );
  // }
  // function HandleCloseModalManagePartition(partition, tempPartition) {
  //   if (tempPartition) {
  //     if (partition) {
  //       let index = location.traversal.partitions.findIndex((p) => p.type === partition.type);
  //       location.traversal.partitions.splice(index, 1, tempPartition);
  //     } else {
  //       location.traversal.partitions.push(tempPartition);
  //     }

  //     setLocation({ ...location });
  //   }

  //   setModal(null);
  // }
  // function DeletePartition(partition) {
  //   location.traversal.partitions = location.traversal.partitions.filter((p) => p.type !== partition.type);
  //   setLocation({ ...location });
  // }

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

  function OpenModalManageCreature(creature, name) {
    setModal(
      <ModalManageCreature
        name={name}
        creature={creature}
        contexts={location.contexts.map((c) => c.name)}
        isPointOfInterest={isPointOfInterest}
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
              groupSize: lc.GROUP_SIZES.SOLO,
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

    if (
      (location.size === lc.LOCATION_SIZES.POINT_OF_INTEREST && !location.interaction.type) ||
      (location.size !== lc.LOCATION_SIZES.POINT_OF_INTEREST && !location.traversal.type)
    ) {
      return false;
    }

    if (
      !isWorld &&
      !isFirstOfArea &&
      (location.reference.distance || location.reference.direction || location.reference.location) &&
      (!location.reference.distance || !location.reference.direction || !location.reference.location)
    ) {
      return false;
    }

    return true;
  }

  function ImportAscendance(event) {
    let file = event.target.files[0];

    if (file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        let uploadedLocation = JSON.parse(e.target.result);
        uploadedLocation._id = location._id;
        uploadedLocation.exteriorLocationId = location.exteriorLocationId;
        uploadedLocation.owner = location.owner;
        setLocation(uploadedLocation);
      };
      reader.readAsText(file);
    }
  }

  function HandleAscendanceExport() {
    let exportLocation = utils.clone(location);
    exportLocation._id = null;
    exportLocation.exteriorLocationId = null;
    exportLocation.owner = null;

    utils.downloadObjectAsJson(exportLocation, `${exportLocation.name}`);
  }

  return (
    <div className="EditLocation-container">
      {modal}
      <div className="title-wrapper">
        <h3>Localização</h3>
        <button onClick={() => inputRef.current.click()} className="location-import">
          <i className="fas fa-download"></i>
          <input type="file" onChange={ImportAscendance} ref={inputRef} hidden={true} accept="application/JSON" />
        </button>
      </div>
      <main className="location-fields">
        <TextInput label="Nome" value={location} valuePropertyPath="name" onChange={setLocation} />

        {location.exteriorLocationId != null && (
          <Select
            label={"Tamanho"}
            info={[{ text: "Ex ponto de interesse: Moradia de criatura" }]}
            extraWidth={250}
            value={location}
            valuePropertyPath="size"
            onSelect={HandleSelectSize}
            options={locationSizes}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
          />
        )}

        <div className="divider"></div>

        {(location.size && location.size !== lc.LOCATION_SIZES.POINT_OF_INTEREST) || location.exteriorLocationId == null ? (
          <>
            <div className="location-row df df-jc-sb">
              <Select
                label={"Tipo"}
                extraWidth={60}
                value={location}
                valuePropertyPath="traversal.type"
                onSelect={setLocation}
                options={creatureEnvironments}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
              <Select
                label={"Prob. Terreno Irregular"}
                extraWidth={85}
                value={location}
                valuePropertyPath="traversal.irregularTerrainFrequency"
                onSelect={setLocation}
                options={lc.irregularTerrainFrequencies}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
            </div>
            {/* {location.exteriorLocationId != null && (
              <div className="location-detail-group">
                <div className="location-row location-detail-group-title">
                  <span>Partições</span>
                  <button onClick={() => OpenModalManagePartition()} disabled={location.traversal.partitions.length === 2}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {location.traversal.partitions.map((p) => (
                  <div className="location-row location-detail-group-item" key={p.type}>
                    <span>{lc.GetPartitionType(p.type).display}</span>
                    <div className="group-item-actions">
                      <button onClick={() => OpenModalManagePartition(p)}>
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button onClick={() => DeletePartition(p)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )} */}
            {location.exteriorLocationId != null && (
              <div className="location-detail-group">
                <div className="location-row location-detail-group-title">
                  <span>Elementos</span>
                  <button onClick={() => OpenModalManageElement()} disabled={location.traversal.elements.length === 6}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {location.traversal.elements.map((e) => (
                  <div className="location-row location-detail-group-item" key={e.type}>
                    <span>{lc.GetPartitionType(e.type).display}</span>
                    <div className="group-item-actions">
                      <button onClick={() => OpenModalManageElement(e)}>
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button onClick={() => DeleteElement(e)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="location-row df df-jc-sb df-ai-fs">
              <Select
                label={"Tipo"}
                extraWidth={60}
                value={location}
                valuePropertyPath="interaction.type"
                onSelect={setLocation}
                options={lc.elementTypes}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
              <CheckInput
                label="Toque Perigoso"
                info={[
                  { text: "Ravinas profundas, lagos poluidos, estruturas desmoronantes, rochas afiadas, plantas venenosas, objetos armadilhas" },
                ]}
                onClick={() => setLocation({ ...location, interaction: { ...location.interaction, isHazardous: !location.interaction.isHazardous } })}
                isSelected={location.interaction.isHazardous}
                className="interaction"
              />
            </div>
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

        {!isWorld && !isFirstOfArea && (
          <>
            <div className="divider"></div>
            <div className="location-row df df-jc-sb">
              <Select
                label={"Distância"}
                extraWidth={12}
                value={location}
                valuePropertyPath="reference.distance"
                onSelect={HandleSelectRefDistance}
                nothingSelected="-"
                options={lc.referenceDistances}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
              <Select
                label={"Direção"}
                extraWidth={12}
                value={location}
                valuePropertyPath="reference.direction"
                onSelect={HandleSelectRefDirection}
                nothingSelected="-"
                options={lc.directions}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
              <Select
                label={"Conectado Por"}
                extraWidth={12}
                value={location}
                valuePropertyPath="reference.connectionType"
                onSelect={setLocation}
                nothingSelected="Nada"
                options={lc.locationConnectionTypes}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
              />
            </div>
            <Select
              label={"Localização"}
              extraWidth={250}
              value={location}
              valuePropertyPath="reference.location"
              onSelect={setLocation}
              nothingSelected="-"
              options={referenceLocations}
              optionDisplay={(o) => o.refListName}
              optionValue={(o) => o._id}
            />
          </>
        )}
        <div className="divider"></div>

        <div className="location-detail-group">
          <div className="location-row location-detail-group-title">
            <span>Contextos</span>
            <button onClick={() => OpenModalManageContext()}>
              <i className="fas fa-plus"></i>
            </button>
          </div>
          {location.contexts.map((c, index) => (
            <div className="location-row location-detail-group-item" key={c.name}>
              <div className="df df-cg-10">
                <CheckInput isSelected={c.isCurrent} onClick={() => HandleSelectContext(c)} />
                <span>{c.name}</span>
              </div>
              <div className="group-item-actions">
                <button onClick={() => OpenModalManageContext(c)}>
                  <i className="fas fa-pencil-alt"></i>
                </button>
                <button onClick={() => DeleteContext(c)} disabled={index === 0}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="divider"></div>

        <div className="location-detail-group">
          <div className="location-row location-detail-group-title">
            <span>Criaturas</span>
            <button onClick={() => HandleSelectCreatures()}>
              <i className="fas fa-plus"></i>
            </button>
          </div>
          {location.creatures.map((lc) => {
            const name = creatures.find((c) => c._id === lc.creatureId).name;

            return (
              <div className="location-row location-detail-group-item" key={lc.creatureId}>
                <span>{name}</span>
                <div className="group-item-actions">
                  <button onClick={() => OpenModalManageCreature(lc, name)}>
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                  <button onClick={() => DeleteCreature(lc)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <footer className="action-buttons">
        {HandleDelete && (
          <>
            <button className="button-simple" onClick={OpenModalDeleteLocation}>
              <i className="fas fa-trash"></i>
            </button>
            <button className="button-simple" onClick={OpenModalMoveLocation}>
              <i className="fas fa-exchange-alt"></i>
            </button>
            <button className="button-simple" onClick={HandleAscendanceExport}>
              <i className="fas fa-upload"></i>
            </button>
          </>
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
