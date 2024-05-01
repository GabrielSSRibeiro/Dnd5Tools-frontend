import React, { useState, useMemo, useRef } from "react";
import * as utils from "../../../../../../utils";
import * as lc from "../../../../../../constants/locationConstants";
import { CREATURE_ENVIRONMENTS, creatureEnvironments } from "../../../../../../constants/creatureConstants";
import * as lh from "../../../../../../helpers/locationHelper";

import Button from "../../../../../../components/Button";
import TextInput from "../../../../../../components/TextInput";
import Select from "../../../../../../components/Select";
import CheckInput from "../../../../../../components/CheckInput";
import ModalDeleteLocation from "./components/ModalDeleteLocation";
import ModalMoveLocation from "./components/ModalMoveLocation";
import ModalManageElement from "./components/ModalManageElement";
import ModalManageContext from "./components/ModalManageContext";
import Dungeon from "../Dungeon";
import CreatureManager from "../CreatureManager";
import ModalWarning from "../../../../../../components/ModalWarning";

import "./styles.css";

function EditLocation({
  locationToEdit,
  UpdateLocation,
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
  GetAllInteriorLocs,
  isNewLoc,
}) {
  let inputRef = useRef(null);
  const [location, setLocation] = useState(utils.clone(locationToEdit));
  const [willAdjustMap, setWillAdjustMap] = useState(false);
  const [modal, setModal] = useState(null);

  const locationSizes = useMemo(() => {
    let locationSizes = utils.clone(lc.locationSizes);

    if (map[location._id] && Object.values(map[location._id].interiorLocs).length > 0) {
      locationSizes = locationSizes.filter((ls) => ls.value !== lc.LOCATION_SIZES.POINT_OF_INTEREST);
    }

    //add real value to display
    locationSizes
      .filter((s) => s.value !== lc.LOCATION_SIZES.POINT_OF_INTEREST)
      .forEach((s) => {
        s.display += ` (raio ${utils.MInUnits((lc.BASE_VISION_IN_M * s.baseRadiusMultiplier) / 4, 1)})`;
      });

    return locationSizes;
  }, [location._id, map]);
  const referenceDistances = useMemo(() => {
    let referenceDistances = utils.clone(lc.referenceDistances);

    //add real value to display
    referenceDistances
      .filter((r) => r.value !== lc.REFERENCE_DISTANCES.ADJACENT)
      .forEach((r) => {
        r.display += ` (${utils.MInUnits((lc.BASE_VISION_IN_M * r.baseDistanceMultiplier) / 4, 1)})`;
      });

    return referenceDistances;
  }, []);
  const referenceLocations = useMemo(() => {
    let refLocations = [];

    locations
      .filter(
        (l) => l._id !== location._id && l.exteriorLocationId === location.exteriorLocationId && !l.isHidden && l.reference.location !== location._id
      )
      .forEach((rl) => {
        const interiorLocs = GetAllInteriorLocs(rl);
        if (interiorLocs.length > 0) {
          rl.refListName = interiorLocs.find(
            (il) => !il.data.reference.location && !il.isHidden && Object.keys(il.interiorLocs).length === 0
          ).data.name;
        } else {
          rl.refListName = rl.name;
        }

        refLocations.push(rl);
      });

    return refLocations;
  }, [GetAllInteriorLocs, location._id, location.exteriorLocationId, locations]);
  const isWorld = useMemo(() => !location.exteriorLocationId, [location]);
  const isPointOfInterest = useMemo(() => location.size === lc.LOCATION_SIZES.POINT_OF_INTEREST, [location]);
  const isFirstOfArea = useMemo(
    //if there is no option or there isn't any loc that doesn't have a ref loc
    () => referenceLocations.length === 0 || !referenceLocations.some((l) => !l.reference.location),
    [referenceLocations]
  );

  function HandleSaveLocation(isDraft = false) {
    location.isDraft = isDraft;

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

    HandleSave(location, willAdjustMap);
  }

  function OpenModalDeleteLocation() {
    setModal(
      <ModalDeleteLocation
        title="Deletar Localização"
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
    // location.reference.connectionType = null;
    setWillAdjustMap(true);
    HandleUpdateOnSelect();
  }

  function HandleSelectRefLocation() {
    setWillAdjustMap(true);
    HandleUpdateOnSelect();
  }

  function HandleSelectRefDistance(updatedValue) {
    location.distanceMultiplier = updatedValue.reference.distance ? lh.GetDistanceMultiplier(updatedValue.reference.distance) : null;

    setWillAdjustMap(true);
    HandleUpdateOnSelect();
  }

  function HandleSelectRefDirection(updatedValue) {
    location.distanceAngle = updatedValue.reference.direction ? lh.GetDistanceAngle(updatedValue.reference.direction) : null;

    setWillAdjustMap(true);
    HandleUpdateOnSelect();
  }

  function HandleSelectRefCon(updatedValue) {
    if (!updatedValue.reference.connectionType) {
      location.reference.connectionAngle = null;
      location.reference.connectionAngleOrigin = null;
    }

    setWillAdjustMap(true);
    HandleUpdateOnSelect();
  }

  function HandleSelectRefConAngle(updatedValue) {
    if (!updatedValue.reference.connectionAngle) {
      location.reference.connectionAngleOrigin = null;
    }

    setWillAdjustMap(true);
    HandleUpdateOnSelect();
  }

  function HandleUpdateOnSelect() {
    setLocation({ ...location });
    UpdateLocation(location);
  }

  function HandleSelectContext(context) {
    location.contexts.forEach((c) => {
      c.isCurrent = c.name === context.name && !c.isCurrent;
    });
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

  function HandleSelectCreatures(creaturesObj, setter) {
    setSelectedCreatures(creatures.filter((c) => creaturesObj.creatures.some((lc) => lc.creatureId === c._id)));
    HandleSelectFromBestiary((tempSelectedCreatures) => HandleSelectedCreatures(creaturesObj, setter, tempSelectedCreatures));
  }

  function HandleSelectedCreatures(creaturesObj, setter, tempSelectedCreatures) {
    //remove removed creatures
    creaturesObj.creatures = creaturesObj.creatures.filter((lc) => tempSelectedCreatures.some((sc) => sc._id === lc.creatureId));

    //Add new creatures
    tempSelectedCreatures
      .filter((sc) => !creaturesObj.creatures.some((lc) => lc.creatureId === sc._id))
      .forEach((sc) => {
        creaturesObj.creatures.push({
          creatureId: sc._id,
          population: null,
          routines: [
            {
              schedule: null,
              precipitation: null,
              temperature: null,
              context: null,
              encounterFrequency: isPointOfInterest ? lc.ENCOUNTER_FREQUENCIES.CERTAIN : lc.ENCOUNTER_FREQUENCIES.MEDIUM,
              groupSize: lc.GROUP_SIZES.SOLO,
            },
          ],
        });
      });

    UpdateBoundCreatures(creaturesObj);
    setter({ ...creaturesObj });
  }

  function UpdateBoundCreatures(creaturesObj) {
    let boundCreatures = [];
    creaturesObj.boundCreatures.forEach((b) => {
      b = b.filter((cId) => creaturesObj.creatures.some((c) => c.creatureId === cId));
      if (b.length > 1) {
        boundCreatures.push(b);
      }
    });
    creaturesObj.boundCreatures = boundCreatures;
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

    if (
      (location.reference.connectionAngle || location.reference.connectionAngleOrigin) &&
      (!location.reference.connectionAngle || !location.reference.connectionAngleOrigin)
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

    utils.downloadData(JSON.stringify(exportLocation), `${exportLocation.name}.json`);
  }

  function HandleHide() {
    location.reference.distance = null;
    location.reference.direction = null;
    location.reference.location = null;
    HandleSaveLocation();
  }

  function HandleWorldExport() {
    function AddLocationsData(locs) {
      lh.sortLocsByRef(locs.map((l) => l.data)).forEach((l) => {
        let location = locs.find((loc) => loc.data._id === l._id);
        content.push(...lh.GetLocationDataForExport(location.data, creatures));

        const interiorLocs = Object.keys(location.interiorLocs).map((locId) => map[locId]);
        AddLocationsData(interiorLocs);
      });
    }

    let content = lh.GetLocationDataForExport(world, creatures);

    const rootLocs = Object.keys(map)
      .filter((locationId) => !map[map[locationId].data.exteriorLocationId])
      .map((locId) => map[locId]);
    AddLocationsData(rootLocs);

    //remove last divider
    content.pop();

    utils.downloadData(content.join("\n\n"), `${world.name}.txt`);
  }

  function OpenModalConfirmReset() {
    setModal(
      <ModalWarning
        title="Resetar Masmorra"
        messages={[
          "Deletar versao atual da masmorra?",
          "Isso bloqueará saidas bloqueáveis e fará com que rotinas sejam reavalidas quando interagido durante exploraçao, criando uma nova versao",
        ]}
        actions={[
          {
            text: "Cancelar",
            click: () => setModal(null),
            isSimple: true,
          },
          {
            text: "Resetar",
            click: HandleCloneModalReset,
          },
        ]}
      />
    );
  }
  function HandleCloneModalReset() {
    location.interaction.currentCreatures = null;
    location.interaction.rooms
      .filter((r) => r)
      .forEach((r) => {
        if (r.top.connection === lc.ROOM_CONNECTIONS.UNBLOCKED) {
          r.top.connection = lc.ROOM_CONNECTIONS.BLOCKED;
        }

        if (r.bottom.connection === lc.ROOM_CONNECTIONS.UNBLOCKED) {
          r.bottom.connection = lc.ROOM_CONNECTIONS.BLOCKED;
        }

        if (r.left.connection === lc.ROOM_CONNECTIONS.UNBLOCKED) {
          r.left.connection = lc.ROOM_CONNECTIONS.BLOCKED;
        }

        if (r.right.connection === lc.ROOM_CONNECTIONS.UNBLOCKED) {
          r.right.connection = lc.ROOM_CONNECTIONS.BLOCKED;
        }

        if (r.floor.connection === lc.ROOM_CONNECTIONS.UNBLOCKED) {
          r.floor.connection = lc.ROOM_CONNECTIONS.BLOCKED;
        }

        if (r.ceiling.connection === lc.ROOM_CONNECTIONS.UNBLOCKED) {
          r.ceiling.connection = lc.ROOM_CONNECTIONS.BLOCKED;
        }

        r.currentCreatures = null;
      });
    setModal(null);
  }

  return (
    <div className="EditLocation-container">
      {modal}
      <div className="title-wrapper">
        <h3>Localização</h3>
        <button title="Importar" onClick={() => inputRef.current.click()} className="location-import">
          <i className="fas fa-download"></i>
          <input type="file" onChange={ImportAscendance} ref={inputRef} hidden={true} accept="application/JSON" />
        </button>
      </div>
      <main id="EditLocation-scroll" className="location-fields">
        <TextInput label="Nome" value={location} valuePropertyPath="name" onChange={setLocation} />

        {/* size */}
        {location.exteriorLocationId != null && (
          <Select
            label={"Tamanho"}
            icon="fas fa-dot-circle"
            info={[{ text: "Exemplo ponto de interesse: Moradia de criatura" }]}
            extraWidth={250}
            value={location}
            valuePropertyPath="size"
            optionsAtATime={10}
            onSelect={HandleSelectSize}
            options={locationSizes}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
          />
        )}
        {(location.size && location.size !== lc.LOCATION_SIZES.POINT_OF_INTEREST) || location.exteriorLocationId == null ? (
          <Select
            label={"Tipo"}
            extraWidth={250}
            value={location}
            valuePropertyPath="traversal.type"
            onSelect={HandleUpdateOnSelect}
            options={creatureEnvironments.filter((e) => e.value !== CREATURE_ENVIRONMENTS.URBAN && e.value !== CREATURE_ENVIRONMENTS.ALL)}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
          />
        ) : (
          <Select
            label={"Tipo"}
            extraWidth={250}
            value={location}
            valuePropertyPath="interaction.type"
            onSelect={HandleUpdateOnSelect}
            options={lc.elementTypes}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
          />
        )}

        {/* reference */}
        {!isWorld && !isFirstOfArea && (
          <>
            <div className="divider"></div>
            <Select
              label={"Localização de Referência"}
              icon="fas fa-map-marked-alt"
              extraWidth={250}
              value={location}
              valuePropertyPath="reference.location"
              onSelect={HandleSelectRefLocation}
              nothingSelected="-"
              options={referenceLocations}
              optionDisplay={(o) => o.refListName}
              optionValue={(o) => o._id}
              optionsAtATime={10}
            />

            <div className="location-row df df-jc-sb">
              <Select
                label={"Distância"}
                extraWidth={125}
                value={location}
                valuePropertyPath="reference.distance"
                onSelect={HandleSelectRefDistance}
                nothingSelected="-"
                options={referenceDistances}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                optionsAtATime={10}
              />
              <Select
                label={"Direção"}
                extraWidth={20}
                value={location}
                valuePropertyPath="reference.direction"
                onSelect={HandleSelectRefDirection}
                nothingSelected="-"
                options={lc.directions}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                optionsAtATime={10}
              />
            </div>
            <div className="location-row df df-jc-sb">
              <Select
                label={"Conectado por"}
                extraWidth={20}
                value={location}
                valuePropertyPath="reference.connectionType"
                onSelect={HandleSelectRefCon}
                nothingSelected="-"
                options={lc.locationConnectionTypes}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                optionsAtATime={6}
              />
              <Select
                label={"Rotaçao de"}
                extraWidth={0}
                value={location}
                valuePropertyPath="reference.connectionAngle"
                onSelect={HandleSelectRefConAngle}
                nothingSelected="-"
                options={lc.directions.filter((d) => d.baseAngle)}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                optionsAtATime={10}
                isDisabled={!location.reference.connectionType}
              />
              <Select
                label={"Origem em"}
                extraWidth={20}
                value={location}
                valuePropertyPath="reference.connectionAngleOrigin"
                onSelect={HandleUpdateOnSelect}
                nothingSelected="-"
                options={lc.locationConnectionAngleOrigins}
                optionDisplay={(o) => o.display}
                optionValue={(o) => o.value}
                optionsAtATime={6}
                isDisabled={!location.reference.connectionType}
              />
            </div>
          </>
        )}
        <div className="divider"></div>

        {/* contexts */}
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
                <span className={!c.firstImpressions ? `lacking-data` : ""}>
                  {index + 1}. {c.name}
                </span>
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

        {/* elements */}
        {location.size && location.size !== lc.LOCATION_SIZES.POINT_OF_INTEREST && location.exteriorLocationId != null && (
          <>
            <div className="divider"></div>
            <div className="location-detail-group">
              <div className="location-row location-detail-group-title">
                <span className={location.traversal.elements.length === 0 ? `lacking-data` : ""}>Elementos de Travessia</span>
                <button onClick={() => OpenModalManageElement()} disabled={location.traversal.elements.length === lc.elementTypes.length}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              {location.traversal.elements.map((e) => (
                <div className="location-row location-detail-group-item" key={e.type}>
                  <span>{lc.GetElementType(e.type).display}</span>
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
          </>
        )}

        <div className="divider"></div>

        {/* dungeon */}
        {location.size && location.size === lc.LOCATION_SIZES.POINT_OF_INTEREST ? (
          <div className="location-detail-group">
            <div className="location-row location-detail-group-title">
              <span>Disposição</span>
              {HandleDelete && (
                <button onClick={OpenModalConfirmReset}>
                  <i className="fas fa-undo-alt"></i>
                </button>
              )}
            </div>
            <Dungeon
              location={location}
              setLocation={setLocation}
              HandleSelectCreatures={HandleSelectCreatures}
              creatures={creatures}
              isEdit={true}
            />
          </div>
        ) : (
          // creatures
          <CreatureManager
            data={location}
            setData={setLocation}
            contexts={location.contexts}
            creatures={creatures}
            HandleSelectCreatures={HandleSelectCreatures}
            UpdateBoundCreatures={UpdateBoundCreatures}
            map={map}
            isWorld={isWorld}
            isPointOfInterest={false}
          />
        )}
      </main>
      <footer className="action-buttons">
        {HandleDelete ? (
          <>
            <button title="Deletar" className="button-simple" onClick={OpenModalDeleteLocation}>
              <i className="fas fa-trash"></i>
            </button>
            <button title="Mover" className="button-simple" onClick={OpenModalMoveLocation}>
              <i className="fas fa-exchange-alt"></i>
            </button>
            <button title="Exportar" className="button-simple" onClick={HandleAscendanceExport}>
              <i className="fas fa-upload"></i>
            </button>
            {!isWorld && !isFirstOfArea && (
              <button title="Ocultar" className="button-simple" onClick={HandleHide}>
                <i className="fas fa-eye-slash"></i>
              </button>
            )}
          </>
        ) : (
          !isNewLoc && (
            <button title="Exportar Mundo" className="button-simple" onClick={HandleWorldExport}>
              <i className="fas fa-upload"></i>
            </button>
          )
        )}
        <div className="basic-actions">
          <button className="button-simple" onClick={FinishEditing}>
            Cancelar
          </button>
          <Button icon="fas fa-pencil-ruler" info={[{ text: "Rascunho" }]} onClick={() => HandleSaveLocation(true)} isDisabled={!IsLocationValid()} />
          <Button text={isNewLoc ? "Adicionar" : "Salvar"} onClick={HandleSaveLocation} isDisabled={!IsLocationValid()} />
        </div>
      </footer>
    </div>
  );
}

export default EditLocation;
