import React, { useState, useMemo } from "react";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as utils from "../../../../../../../../utils";

import Modal from "../../../../../../../../components/Modal";
import Button from "../../../../../../../../components/Button";
import Select from "../../../../../../../../components/Select";
import TextInput from "../../../../../../../../components/TextInput";

import "./styles.css";

function ModalManageConnection({ connection, onClose }) {
  const [tempConnection, setTempConnection] = useState(
    connection
      ? utils.clone(connection)
      : {
          seed: utils.seededRandom() + "",
          distance: null,
          direction: null,
          connectionType: null,
          connectionAngle: null,
          connectionAngleOrigin: null,
          description: null,
          depth: null,
        }
  );
  const referenceDistances = useMemo(() => {
    let referenceDistances = utils.clone(lc.referenceDistances);

    referenceDistances = referenceDistances.filter(
      (r) => r.value !== lc.REFERENCE_DISTANCES.ADJACENT && r.value !== lc.REFERENCE_DISTANCES.EXTERIOR_ADJACENT
    );

    referenceDistances.forEach((r) => {
      r.display += ` (${utils.MInUnits((lc.BASE_VISION_IN_M * r.baseDistanceMultiplier) / 4, 1)})`;
    });

    return referenceDistances;
  }, []);

  function HandleSelectRefCon(updatedValue) {
    if (!updatedValue.connectionType) {
      tempConnection.connectionAngle = null;
      tempConnection.connectionAngleOrigin = null;
    }

    setTempConnection({ ...tempConnection });
  }

  function HandleSelectRefConAngle(updatedValue) {
    if (!updatedValue.connectionAngle) {
      tempConnection.connectionAngleOrigin = null;
    }

    setTempConnection({ ...tempConnection });
  }

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempConnection);
  }

  function CheckFinalButtonValid() {
    if (!tempConnection.distance || !tempConnection.direction || !tempConnection.connectionType) {
      return false;
    }

    if (
      (tempConnection.connectionAngle || tempConnection.connectionAngleOrigin) &&
      (!tempConnection.connectionAngle || !tempConnection.connectionAngleOrigin)
    ) {
      return false;
    }

    return true;
  }

  return (
    <Modal title="Conexão" className="ModalManageConnection-container" onClickToClose={onClose}>
      <div className="new-connection-wrapper">
        <div className="location-row df df-jc-sb">
          <Select
            label={"Distância"}
            extraWidth={125}
            value={tempConnection}
            valuePropertyPath="distance"
            onSelect={setTempConnection}
            nothingSelected="-"
            options={referenceDistances}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
            optionsAtATime={10}
          />
          <Select
            label={"Direção"}
            extraWidth={20}
            value={tempConnection}
            valuePropertyPath="direction"
            onSelect={setTempConnection}
            nothingSelected="-"
            options={lc.directions}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
            optionsAtATime={10}
          />
        </div>

        <div className="location-row df df-jc-sb">
          <Select
            label={"Tipo"}
            extraWidth={20}
            value={tempConnection}
            valuePropertyPath="connectionType"
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
            value={tempConnection}
            valuePropertyPath="connectionAngle"
            onSelect={HandleSelectRefConAngle}
            nothingSelected="-"
            options={lc.directions.filter((d) => d.baseAngle)}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
            optionsAtATime={10}
            isDisabled={!tempConnection.connectionType}
          />
          <Select
            label={"Origem em"}
            extraWidth={20}
            value={tempConnection}
            valuePropertyPath="connectionAngleOrigin"
            onSelect={setTempConnection}
            nothingSelected="-"
            options={lc.locationConnectionAngleOrigins.filter((o) => o.value !== lc.LOCATION_CONNECTION_ANGLE_ORIGINS.START)}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
            optionsAtATime={6}
            isDisabled={!tempConnection.connectionType}
          />
        </div>

        <TextInput label="Descriçao" value={tempConnection} valuePropertyPath="description" onChange={setTempConnection} />
        <Select
          label={"Profundidade"}
          extraWidth={250}
          value={tempConnection}
          valuePropertyPath="depth"
          nothingSelected="-"
          onSelect={setTempConnection}
          options={lc.conDepths}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
      </div>
      <footer>
        <button className="button-simple" onClick={HandleCancel}>
          Cancelar
        </button>
        <Button text="Salvar" onClick={HandleConfirm} isDisabled={!CheckFinalButtonValid()} />
      </footer>
    </Modal>
  );
}

export default ModalManageConnection;
