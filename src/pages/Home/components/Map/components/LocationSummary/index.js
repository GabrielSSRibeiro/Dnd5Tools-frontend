import React, { useState, useMemo, useRef } from "react";
import * as utils from "../../../../../../utils";
import * as cc from "../../../../../../constants/creatureConstants";
import * as lc from "../../../../../../constants/locationConstants";
import * as lh from "../../../../../../helpers/locationHelper";

import "./styles.css";

import ModalLocationDetails from "../ModalLocationDetails";

function LocationSummary({
  userId,
  location,
  map,
  connection,
  id,
  setLocationToEdit,
  setLocHoverData,
  locations,
  creatures,
  world,
  schedule,
  precipitation,
  temperature,
  distance = null,
  willExhaust,
  canTravelToPoint,
  lastEncounterLocId,
}) {
  const [modal, setModal] = useState(null);
  const avatarProportion = useRef(60);
  const dangerColor = useRef(lc.GetHazardousness(lc.HAZARDOUSNESS.EXTREME).color);

  function OpenModalLocationDetails(loc, locId, defaultLevel) {
    setLocationToEdit(null);
    setModal(
      <ModalLocationDetails
        location={loc}
        map={map}
        id={locId}
        defaultLevel={defaultLevel}
        locations={locations}
        onClose={setModal}
        HandleEditNewLocation={HandleEditNewLocation}
        OpenModalLocationDetails={OpenModalLocationDetails}
        HandleEditLocation={HandleEditLocation}
        creatures={creatures}
      />
    );
  }

  function HandleEditLocation(loc) {
    setLocationToEdit(utils.clone(loc));
    setLocHoverData(null);
    setModal(null);
  }

  function HandleEditNewLocation(exteriorLocationId) {
    setLocationToEdit(lc.GetNewLocation(userId, exteriorLocationId));
  }

  const shouldRollEncounter = useMemo(
    () =>
      distance?.encounterProb >= 0.245 ||
      location._id !== lastEncounterLocId ||
      (!location._id && lastEncounterLocId) ||
      (location._id && !lastEncounterLocId),
    [distance?.encounterProb, location._id, lastEncounterLocId]
  );

  const isVisible = useMemo(
    () => schedule !== lc.ROUTINE_SCHEDULES.NIGHT && (distance?.isVisible || location.traversal.type === cc.CREATURE_ENVIRONMENTS.MOUNTAIN),
    [distance?.isVisible, location.traversal.type, schedule]
  );

  const currentContext = useMemo(() => lh.GetCurrentContext(location), [location]);
  const worldContext = useMemo(() => lh.GetCurrentContext(world), [world]);
  const type = useMemo(() => {
    if (connection?.type) {
      return lc.GetLocationConnectionType(connection.type).display;
    }

    return location.size === lc.LOCATION_SIZES.POINT_OF_INTEREST
      ? lc.GetElementType(location.interaction.type).display
      : cc.GetEnviroment(location.traversal.type).display;
  }, [connection?.type, location.interaction?.type, location.size, location.traversal?.type]);

  const name = useMemo(() => {
    let name = location.name;

    if (connection) {
      name = type;
      if (connection.depth) {
        name += ", " + lc.GetConDepth(connection.depth).metersDisplay + " (profundo)";
      }
    }

    return name;
  }, [connection, location.name, type]);
  const firstImpressions = useMemo(
    () => (connection ? connection.description : currentContext?.firstImpressions),
    [connection, currentContext?.firstImpressions]
  );
  const shouldlAddWorldCreatures = useMemo(
    () => world.name !== location.name && worldContext.name !== lc.DEFAULT_CONTEXT_NAME,
    [location.name, world.name, worldContext.name]
  );
  const creaturesForDisplay = useMemo(() => {
    if (creatures.length === 0 || connection) {
      return [];
    }

    const currentLocCreatures =
      location.size === lc.LOCATION_SIZES.POINT_OF_INTEREST && location.interaction?.currentCreatures
        ? location.creatures.filter((c) => location.interaction.currentCreatures.some((cc) => cc.creatureId === c.creatureId && !cc.isDead))
        : location.creatures;

    //add world context creatues
    let allCreatures = shouldlAddWorldCreatures ? [...currentLocCreatures, ...world.creatures] : currentLocCreatures;

    let creaturesForDisplay = allCreatures
      .filter((c) => !c.population || c.population.current > 0)
      .map((locationCreature) => ({
        creature: creatures.find((c) => c._id === locationCreature.creatureId),
        routine: currentLocCreatures.some((lc) => lc.creatureId === locationCreature.creatureId)
          ? lh.GetCreatureCurrentRoutine(locationCreature, schedule, precipitation, temperature, currentContext?.name)
          : lh.GetCreatureCurrentRoutine(locationCreature, schedule, precipitation, temperature, worldContext?.name),
      }))
      .filter((c) => c.routine)
      .map((c) => {
        const rarity = cc.GetRarity(c.creature.rarity);

        return {
          creatureId: c.creature._id,
          color: rarity.color,
          opacity: `${lc.GetEncounterFrequency(parseInt(c.routine.encounterFrequency)).opacity}`,
          image: c.creature.image,
          imageX: c.creature.imageX,
          imageY: c.creature.imageY,
          imageScale: c.creature.imageScale,
          baseOutputMax: rarity.baseOutputMax,
        };
      });

    creaturesForDisplay.sort((a, b) => b.opacity - a.opacity);

    //group and sort by rarity
    let sortedCreaturesForDisplay = [];
    Object.values(utils.GroupArrayBy(creaturesForDisplay, "opacity")).forEach((g) => {
      g.sort((a, b) => b.baseOutputMax - a.baseOutputMax);
      sortedCreaturesForDisplay.push(...g);
    });

    const SHOW_AT_A_TIME = 3;
    return sortedCreaturesForDisplay.filter((_, i) => i < SHOW_AT_A_TIME);
  }, [
    connection,
    creatures,
    location.size,
    location.interaction,
    location.creatures,
    shouldlAddWorldCreatures,
    world.creatures,
    schedule,
    precipitation,
    temperature,
    currentContext?.name,
    worldContext?.name,
  ]);

  return (
    <div className="LocationSummary-container">
      {modal}
      <div className="body-container" style={distance ? { borderColor: lc.GetHazardousness(currentContext.hazardousness).color } : {}}>
        {/* name and actions */}
        <header className="header">
          {!distance && (
            <aside className="header-action">
              <button title="Adicionar Dentro" onClick={() => HandleEditNewLocation(id)} disabled={locations.length >= 100}>
                <i className="fas fa-plus"></i>
              </button>
            </aside>
          )}
          <span className="name">{name}</span>
          {!distance && (
            <aside className="header-details">
              <button title="Abrir Detalhes" onClick={() => OpenModalLocationDetails(location, id, true)}>
                <i className="fas fa-eye"></i>
              </button>
            </aside>
          )}
        </header>
        <footer className="details">
          <div className="divider">
            <div className="df visibility">
              {isVisible ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash" style={{ color: dangerColor.current }}></i>}
            </div>
          </div>

          {location.isDraft && (
            <span className="df df-cg-5 env-type">
              <i className="fas fa-pencil-ruler"></i>Rascunho
            </span>
          )}

          {/* type and dist */}
          <span className="env-type">
            {!connection && type}

            {distance?.valueInUnits ? `${!connection ? ", " : ""}a ${distance.valueInUnits}` : ""}
            {distance?.timeInUnits ? ` / ${distance.timeInUnits}` : ""}
          </span>

          {/* exhaustion */}
          {distance?.valueInUnits && canTravelToPoint && (
            <span className="exhaustion">
              Desgaste: +
              <span className="name" style={willExhaust ? { color: dangerColor.current } : {}}>
                {distance.exhaustionInUnits}
              </span>
            </span>
          )}

          {/* first impressions */}
          {firstImpressions && (
            <>
              <div className="divider"></div>
              <span className="first-impressions">{firstImpressions}</span>
            </>
          )}

          {creaturesForDisplay.length > 0 && (
            <>
              <div className="divider"></div>
              <div className="creature-list">
                {creaturesForDisplay.map((c) => (
                  <div
                    className="df display-creature"
                    key={c.creatureId}
                    style={{
                      width: avatarProportion.current,
                      height: avatarProportion.current,
                      borderColor: c.color,
                      opacity: c.opacity,
                    }}
                  >
                    <img
                      className="creature-avatar"
                      style={{
                        width: avatarProportion.current,
                        height: avatarProportion.current,
                        left: c.imageX != null ? c.imageX * avatarProportion.current : cc.DEFAULT_AVATAR_POSITION,
                        top: c.imageY != null ? c.imageY * avatarProportion.current : cc.DEFAULT_AVATAR_POSITION,
                        transform: `scale(${c.imageScale != null ? c.imageScale : cc.DEFAULT_AVATAR_SCALE})`,
                        transformOrigin: "top left",
                      }}
                      src={c.image}
                      alt="creature-avatar"
                    />
                  </div>
                ))}
              </div>
              {canTravelToPoint && distance?.encounterProb != null && (
                <span className="env-type">
                  Chance encontro:
                  <span className="name" style={shouldRollEncounter ? { color: dangerColor.current } : {}}>
                    {utils.turnValueIntoPercentageString(distance.encounterProb)}
                  </span>
                </span>
              )}
            </>
          )}
        </footer>
      </div>
    </div>
  );
}

export default LocationSummary;
