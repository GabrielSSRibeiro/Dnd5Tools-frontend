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
    data.creatures[cIndex] = creature;
    setData({ ...data, creatures: data.creatures });
  }

  function SwapCreatures(index1, isUp) {
    let index2 = isUp ? 0 : data.creatures.length - 1;
    if (isUp) {
      const i = data.creatures
        .slice(0, index1)
        .toReversed()
        .findIndex((c) => !IsCreatureBound(c.creatureId));
      if (i > -1) {
        index2 = index1 - 1 - i;
      }
    } else {
      const i = data.creatures.slice(index1 + 1).findIndex((c) => !IsCreatureBound(c.creatureId));
      if (i > -1) {
        index2 = index1 + 1 + i;
      }
    }

    utils.SwapElementsInArray(data.creatures, index1, index2);
    setData({ ...data });
  }

  function IsCreatureBound(id) {
    return data.boundCreatures.some((b) => b.includes(id));
  }

  function AreCreaturesBound(index) {
    const c1Id = data.creatures[index - 1].creatureId;
    const c2Id = data.creatures[index].creatureId;

    return data.boundCreatures.some((b) => [c1Id, c2Id].every((id) => b.includes(id)));
  }

  function ToggleBind(index) {
    const c1Id = data.creatures[index - 1].creatureId;
    const c2Id = data.creatures[index].creatureId;
    let creature1binding = data.boundCreatures.find((b) => b.includes(c1Id));
    let creature2binding = data.boundCreatures.find((b) => b.includes(c2Id));

    // console.log("current", ...data.boundCreatures.map((b) => b.map((id) => creatures.find((c) => c._id === id).name)));

    //if both already bound
    if (creature1binding && creature2binding) {
      //console.log("if both already bound");
      data.boundCreatures = data.boundCreatures.filter((b) => ![c1Id, c2Id].some((cId) => b.includes(cId)));

      //if the same binding, split into 2 and keep non empty bindings
      if (creature1binding === creature2binding) {
        // console.log("if the same binding, split into 2 and keep non empty bindings");
        //index of clicked creature
        const indexInBind = creature2binding.findIndex((cId) => cId === c2Id);
        const firstHalf = creature2binding.slice(0, indexInBind);
        const secondHalf = creature2binding.slice(indexInBind);
        // console.log(
        //   "firstHalf",
        //   firstHalf.map((d) => creatures.find((c) => c._id === d).name)
        // );
        // console.log(
        //   "secondHalf",
        //   secondHalf.map((d) => creatures.find((c) => c._id === d).name)
        // );

        if (firstHalf.length > 1) {
          data.boundCreatures.push(firstHalf);
        }

        if (secondHalf.length > 1) {
          data.boundCreatures.push(secondHalf);
        }
      }
      //otherwise, join the two in a single binding
      else {
        //console.log("otherwise, join the two in a single binding");
        data.boundCreatures.push([...creature1binding, ...creature2binding]);
      }
    }
    //if one already bound, add the other to the binding
    else if (creature1binding || creature2binding) {
      //console.log("if one already bound, add the other to the binding");
      if (creature1binding) {
        creature1binding.push(c2Id);
      } else {
        creature2binding.splice(0, 0, c1Id);
      }
    }
    //otherwize, add new binding for the two
    else {
      //console.log("otherwize, add new binding for the two");
      data.boundCreatures.push([c1Id, c2Id]);
    }

    // console.log("new", ...data.boundCreatures.map((b) => b.map((id) => creatures.find((c) => c._id === id).name)));
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
      {/* creatures */}
      {data.creatures.map((locC, cIndex) => {
        const name = creatures.find((c) => c._id === locC.creatureId).name;

        return (
          <div
            className={`location-row location-detail-group-item location-creature${
              cIndex !== 0 && AreCreaturesBound(cIndex) ? " bound-creature" : ""
            }`}
            key={locC.creatureId}
          >
            {/* swap */}
            <fieldset className="df df-fd-c" disabled={IsCreatureBound(locC.creatureId)}>
              <button
                className="df"
                onClick={() => SwapCreatures(cIndex, true)}
                disabled={cIndex === 0 || data.creatures.slice(0, cIndex).every((c) => data.boundCreatures.some((b) => b.includes(c.creatureId)))}
              >
                <i className="fas fa-sort-up position-arrow-up"></i>
              </button>
              <button
                className="df"
                onClick={() => SwapCreatures(cIndex, false)}
                disabled={
                  data.creatures.length - 1 === cIndex ||
                  data.creatures.slice(cIndex + 1).every((c) => data.boundCreatures.some((b) => b.includes(c.creatureId)))
                }
              >
                <i className="fas fa-sort-down position-arrow-down"></i>
              </button>
            </fieldset>
            <div className="df df-fd-c full-width">
              <div className="group-item-actions full-width">
                <span>{name.slice(0, 40)}</span>
                <span className="df df-cg-5">
                  {/* population */}
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
              {/* routines */}
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
            {!isPointOfInterest && cIndex !== 0 && (
              <button title="juntos se possível" className="df creature-lock" onClick={() => ToggleBind(cIndex)}>
                {AreCreaturesBound(cIndex) ? <i className="fas fa-lock"></i> : <i className="fas fa-lock-open"></i>}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CreatureManager;
