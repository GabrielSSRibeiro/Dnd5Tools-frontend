import React, { useState } from "react";

import * as lc from "../../../../../../constants/locationConstants";
import * as utils from "../../../../../../utils";

import ModalManageCreaturePopulation from "./Components/ModalManageCreaturePopulation";
import ModalManageCreatureRoutine from "./Components/ModalManageCreatureRoutine";

import "./styles.css";

function CreatureManager({ data, setData, contexts, creatures, HandleSelectCreatures, isPointOfInterest }) {
  const [modal, setModal] = useState(false);

  function OpenModalManageCreaturePopulation(creature) {
    setModal(
      <ModalManageCreaturePopulation
        population={creature.population}
        onClose={(tempPopulation, isInfinity) => HandleCloseModalManageCreaturePopulation(creature, tempPopulation, isInfinity)}
      />
    );
  }
  function HandleCloseModalManageCreaturePopulation(creature, tempPopulation, isInfinity) {
    if (tempPopulation || (!tempPopulation && isInfinity)) creature.population = tempPopulation;
    setModal(null);
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
    data.creatures[cIndex] = creature;
    setData({ ...data, creatures: data.creatures });
  }

  function SwapCreatures(index1, index2) {
    utils.SwapElementsInArray(data.creatures, index1, index2);
    setData({ ...data });
  }

  return (
    <div className="CreatureManager-container location-detail-group">
      {modal}
      <div className="location-row location-detail-group-title">
        <span className={data.creatures.length === 0 ? `lacking-data` : ""}>Criaturas</span>
        <button onClick={() => HandleSelectCreatures(data, setData)}>
          <i className="fas fa-retweet"></i>
        </button>
      </div>
      {data.creatures.map((locC, cIndex) => {
        const name = creatures.find((c) => c._id === locC.creatureId).name;

        return (
          <div className="location-row location-detail-group-item location-creature" key={locC.creatureId}>
            <div className="df df-fd-c">
              <button className="df" onClick={() => SwapCreatures(cIndex, cIndex - 1)} disabled={cIndex === 0}>
                <i className="fas fa-sort-up position-arrow-up"></i>
              </button>
              <button className="df" onClick={() => SwapCreatures(cIndex, cIndex + 1)} disabled={data.creatures.length - 1 === cIndex}>
                <i className="fas fa-sort-down position-arrow-down"></i>
              </button>
            </div>
            <div className="df df-fd-c full-width">
              <div className="group-item-actions full-width">
                <span>{name.slice(0, 40)}</span>
                <span className="df df-cg-5">
                  {!isPointOfInterest && (
                    <>
                      {locC.population ? `${locC.population.current} / ${locC.population.value}` : <i className="fas fa-infinity"></i>}
                      <button onClick={() => OpenModalManageCreaturePopulation(locC)}>
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                    </>
                  )}
                  <button onClick={() => OpenModalManageRoutine(locC)}>
                    <i className="fas fa-plus"></i>
                  </button>
                </span>
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
          </div>
        );
      })}
    </div>
  );
}

export default CreatureManager;