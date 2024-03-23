import React, { useState, useMemo } from "react";
import * as utils from "../../../../../../utils";
import * as cc from "../../../../../../constants/creatureConstants";
import * as lc from "../../../../../../constants/locationConstants";
import * as lh from "../../../../../../helpers/locationHelper";

import "./styles.css";

import ModalLocationDetails from "../ModalLocationDetails";

function LocationSummary({
  location,
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
  canTravelToPoint,
}) {
  const [modal, setModal] = useState(null);

  function OpenModalLocationDetails(loc, locId, defaultLevel) {
    setLocationToEdit(null);
    setModal(
      <ModalLocationDetails
        location={loc}
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
    setLocationToEdit(lc.GetNewLocation(exteriorLocationId));
  }

  const currentContext = useMemo(() => lh.GetCurrentContext(location), [location]);
  const worldContext = useMemo(() => lh.GetCurrentContext(world), [world]);
  const shouldlAddWorldCreatures = useMemo(
    () => world.name !== location.name && worldContext.name !== lc.DEFAULT_CONTEXT_NAME,
    [location.name, world.name, worldContext.name]
  );

  const creaturesForDisplay = useMemo(() => {
    if (creatures.length === 0) {
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
          <span className="name">{location.name}</span>
          {!distance && (
            <aside className="header-details">
              <button title="Abrir Detalhes" onClick={() => OpenModalLocationDetails(location, id, true)}>
                <i className="fas fa-book"></i>
              </button>
            </aside>
          )}
        </header>
        <footer className="details">
          <div className="divider"></div>

          {/* type and dist */}
          <span className="env-type">
            {location.size === lc.LOCATION_SIZES.POINT_OF_INTEREST
              ? lc.GetElementType(location.interaction.type).display
              : cc.GetEnviroment(location.traversal.type).display}

            {distance?.valueInUnits ? `, a ${distance.valueInUnits}` : ""}
            {distance?.timeInUnits ? ` / ${distance.timeInUnits}` : ""}
          </span>

          {/* exhaustion */}
          {canTravelToPoint && (
            <span className="exhaustion">
              Desgaste: +<span className="name">{distance.exhaustionInUnits}</span>
            </span>
          )}

          {/* first impressions */}
          {lh.GetCurrentContext(location)?.firstImpressions && (
            <>
              <div className="divider"></div>
              <span className="first-impressions">{location.contexts.find((c) => c.isCurrent).firstImpressions}</span>
            </>
          )}

          {creaturesForDisplay.length > 0 && (
            <>
              <div className="divider"></div>
              <div className="creature-list">
                {creaturesForDisplay.map((c) => (
                  <img
                    key={c.creatureId}
                    className="creature-avatar"
                    style={{
                      borderColor: c.color,
                      opacity: c.opacity,
                    }}
                    src={c.image}
                    alt="creature-avatar"
                  />
                ))}
              </div>
              {canTravelToPoint && distance?.encounterProb != null && creaturesForDisplay.length > 0 && (
                <span className="env-type">
                  Chance encontro:
                  <span className="name">{utils.turnValueIntoPercentageString(distance.encounterProb)}</span>
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
