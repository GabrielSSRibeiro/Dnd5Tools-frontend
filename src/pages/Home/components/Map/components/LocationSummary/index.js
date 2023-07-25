import React, { useState, useMemo } from "react";
import * as utils from "../../../../../../utils";
import * as cc from "../../../../../../constants/creatureConstants";
import * as lc from "../../../../../../constants/locationConstants";
import * as lh from "../../../../../../helpers/locationHelper";

import "./styles.css";

import ModalLocationDetails from "../ModalLocationDetails";

function LocationSummary({ location, id, setLocationToEdit, setLocHoverData, locations, creatures, schedule, precipitation, temperature }) {
  const [modal, setModal] = useState(null);

  function OpenModalLocationDetails(loc, locId) {
    setLocationToEdit(null);
    setModal(
      <ModalLocationDetails
        location={loc}
        id={locId}
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

  function HandleEditNewLocation(newLocId) {
    const newLocation = {
      owner: false,
      name: null,
      isHidden: false,
      exteriorLocationId: newLocId,
      size: lc.LOCATION_SIZES.POINT_OF_INTEREST,
      traversal: {
        type: null,
        irregularTerrainFrequency: lc.IRREGULAR_TERRAIN_FREQUENCIES.LOW,
        partitions: [],
        elements: [],
      },
      interaction: {
        isCurrent: false,
        type: null,
        isHazardous: false,
        rarity: null,
      },
      reference: {
        distance: null,
        direction: null,
        location: null,
        connectionType: null,
      },
      contexts: [
        {
          isCurrent: true,
          name: "Normal",
          firstImpressions: null,
          details: null,
          precipitationFrequency: null,
          intenseTemperatureFrequency: null,
          panoramicVision: lc.PANORAMIC_VISIONS.MEDIUM,
          hazardousness: lc.HAZARDOUSNESS.MEDIUM,
          resourceEasiness: lc.RESOURCE_EASINESS.NORMAL,
        },
      ],
      creatures: [],
    };

    setLocationToEdit(newLocation);
  }

  const currentContext = useMemo(() => lh.GetCurrentContext(location), [location]);

  const creaturesForDisplay = useMemo(() => {
    let creaturesForDisplay = location.creatures
      .map((locationCreature) => ({
        creature: creatures.find((c) => c._id === locationCreature.creatureId),
        routine: lh.GetCreatureCurrentRoutine(locationCreature, schedule, precipitation, temperature, currentContext?.name),
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

    return sortedCreaturesForDisplay;
  }, [location, currentContext, schedule, precipitation, temperature, creatures]);

  return (
    <div className="LocationSummary-container">
      {modal}
      <div className="body-container" style={{ borderColor: lc.GetHazardousness(currentContext.hazardousness).color }}>
        <header className="header">
          <aside className="header-action">
            {location.size === lc.LOCATION_SIZES.POINT_OF_INTEREST ? (
              <button onClick={() => {}} disabled>
                <i className="fas fa-route"></i>
              </button>
            ) : (
              <button onClick={() => HandleEditNewLocation(id)} disabled={locations.length >= 100}>
                <i className="fas fa-plus"></i>
              </button>
            )}
          </aside>
          <span className="name">{location.name}</span>
          <aside className="header-details">
            <button onClick={() => OpenModalLocationDetails(location, id)}>
              <i className="fas fa-book"></i>
            </button>
          </aside>
        </header>
        <footer className="details">
          <div className="divider"></div>
          <span className="env-type">
            {location.size === lc.LOCATION_SIZES.POINT_OF_INTEREST
              ? lc.GetElementType(location.interaction.type).display
              : cc.GetEnviroment(location.traversal.type).display}
          </span>
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
            </>
          )}
        </footer>
      </div>
    </div>
  );
}

export default LocationSummary;
