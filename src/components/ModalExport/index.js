import React, { useState, useRef } from "react";
import * as utils from "../../utils";
import { CREATURE_RARITIES, GetRarity } from "../../constants/creatureConstants";
import { GetAverageLevel } from "../../helpers/creatureHelper";
import { GetFoundryFormattedCreature } from "../../helpers/foundryHelper";

import Button from "../Button";
import Select from "../Select";
import Modal from "../Modal";

import "./styles.css";

function ModalExport({ creature, showDetails = false, onClose }) {
  const rarity = useRef(GetRarity(creature.rarity));
  const exports = useRef([
    {
      display: "Ascendance",
      method: HandleAscendanceExport,
    },
    {
      display: "Foundry VTT",
      method: HandleFoundryExport,
    },
  ]);
  const [exportPlatform, setExportPlatform] = useState(exports.current[0]);
  const [exportLevel, setExportLevel] = useState(
    creature.rarity === CREATURE_RARITIES.LEGENDARY ? rarity.current.baseOutputMin : GetAverageLevel(creature.rarity)
  );

  function GetExportVersions() {
    const versionText = ["Mais Fraca", "Fraca", "Média", "Forte", "Mais Forte"];
    const extremeVersion = "Extrema";

    const exportVersions = utils
      .createArrayFromInt(rarity.current.baseOutputMax + 1)
      .slice(rarity.current.baseOutputMin)
      .map((level, index) => ({ display: `${versionText[index] ?? extremeVersion} (Nível ${level})`, value: level }));

    return exportVersions;
  }

  function HandleFoundryExport() {
    const foundryFormattedCreature = GetFoundryFormattedCreature(creature, exportLevel);
    utils.downloadData(JSON.stringify(foundryFormattedCreature), `Foundry Export - ${creature.name}.json`);
  }

  function HandleAscendanceExport() {
    let exportCreature = utils.clone(creature);
    exportCreature._id = null;
    exportCreature.owner = null;

    utils.downloadData(JSON.stringify(exportCreature), `${exportCreature.name}.json`);
  }

  function HandleExport() {
    exportPlatform.method();
  }

  return (
    <Modal className="ModalExport-container" title={creature.name} onClickToClose={onClose}>
      {showDetails && creature.description && <span className="details">{creature.description}</span>}
      <div className="df df-cg-10">
        <Select
          label={"Plataforma"}
          extraWidth={90}
          value={exportPlatform}
          options={exports.current}
          onSelect={setExportPlatform}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o}
          optionsAtATime={10}
          className="version"
        />
        <Select
          label={"Versão (Nível)"}
          info={[{ text: "Dentre as diferentes versões dessa criatura no mundo, qual é essa em particular" }]}
          extraWidth={150}
          value={exportLevel}
          options={GetExportVersions()}
          onSelect={setExportLevel}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
          optionsAtATime={10}
          className="version"
        />
      </div>
      <div className="divider"></div>
      <Button text="Exportar" onClick={HandleExport} />
    </Modal>
  );
}

export default ModalExport;
