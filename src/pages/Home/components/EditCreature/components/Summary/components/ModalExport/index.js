import React, { useState } from "react";
import * as utils from "../../../../../../../../utils";
import { creatureRarities } from "../../../../../../../../constants/creatureConstants";
import { GetFoundryFormattedCreature } from "../../../../../../../../helpers/foundryHelper";

import Button from "../../../../../../../../components/Button";
import Select from "../../../../../../../../components/Select";
import Modal from "../../../../../../../../components/Modal";

import "./styles.css";

function ModalExport({ creature, onClose }) {
  const rarity = creatureRarities.find((r) => r.value === creature.rarity);
  const [exportLevel, setExportLevel] = useState(Math.ceil((rarity.baseOutputMin + rarity.baseOutputMax) / 2));

  function GetExportVersions() {
    const rarity = creatureRarities.find((r) => r.value === creature.rarity);
    const versionText = ["Mais Fraca", "Fraca", "Média", "Forte", "Mais Forte"];
    const extremeVersion = "Extrema";

    const exportVersions = utils
      .createArrayFromInt(rarity.baseOutputMax + 1)
      .slice(rarity.baseOutputMin)
      .map((level, index) => ({ display: `${versionText[index] ?? extremeVersion} (Nível ${level})`, value: level }));

    return exportVersions;
  }

  function HandleFoundryExport() {
    const foundryFormattedCreature = GetFoundryFormattedCreature(creature, exportLevel);
    utils.downloadObjectAsJson(foundryFormattedCreature, `Foundry Export - ${creature.name}.json`);
  }

  return (
    <Modal className="ModalExport-container" title="Exportar Criatura" onClickToClose={onClose}>
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
      <Button text="Foundry VTT" onClick={HandleFoundryExport} isDisabled={!exportLevel} />
    </Modal>
  );
}

export default ModalExport;