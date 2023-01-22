import React from "react";
import * as utils from "../../../../../../../../utils";
import { combatDifficulties } from "../../../../../../../../constants/combatConstants";
import { GetCreatureAdjustedDifficultyRatio, GetCombatDifficulty } from "../../../../../../../../helpers/combatHelper";
import { GetAverageLevel } from "../../../../../../../../helpers/creatureHelper";

import Button from "../../../../../../../../components/Button";
import Modal from "../../../../../../../../components/Modal";

import "./styles.css";

function ModalDifficultySimulator({ creature, difficultyRatio, onClose }) {
  const totalCharacters = [null, ...utils.createArrayFromInt(10)];
  const totalLevels = utils.createArrayFromInt(20);

  return (
    <Modal
      className="ModalDifficultySimulator-container"
      title="Simular Dificuldade"
      info={[
        { text: "Dificuldades simuladas contra variado número de personagens para todos os níveis" },
        { text: "Personangens (P), Nível (N), Dificuldade: Fácil (F), Médio (M), Difícil (D), Extremo (E)" },
      ]}
      onClickToClose={onClose}
    >
      <div className="table">
        {totalCharacters.map((c, cIndex) => (
          <>
            {cIndex > 0 && <div className="row-divider"></div>}
            <div className="row">
              <span className="row-label">{c != null ? `${c + 1} P` : ""}</span>
              {totalLevels.map((l) => (
                <>
                  <div className="column-divider"></div>
                  <div className="column">
                    {cIndex === 0 ? (
                      <span className="column-label">{l + 1} N</span>
                    ) : (
                      combatDifficulties.map((d) => (
                        <button
                          className="cell-item"
                          disabled={
                            d.value !==
                            GetCombatDifficulty(GetCreatureAdjustedDifficultyRatio(difficultyRatio, GetAverageLevel(creature.rarity), l), c + 1)
                          }
                        >
                          <span>{d.shortDisplay}</span>
                        </button>
                      ))
                    )}
                  </div>
                </>
              ))}
            </div>
          </>
        ))}
      </div>
      <Button text="Fechar" onClick={onClose} />
    </Modal>
  );
}

export default ModalDifficultySimulator;
