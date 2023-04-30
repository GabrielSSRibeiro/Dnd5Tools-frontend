import React, { useState } from "react";
import * as lc from "../../../../../../../../constants/locationConstants";
import * as utils from "../../../../../../../../utils";

import Modal from "../../../../../../../../components/Modal";
import Button from "../../../../../../../../components/Button";
import Select from "../../../../../../../../components/Select";

import "./styles.css";

function ModalManagePartition({ partition, partitions, onClose }) {
  const [tempPartition, setTempPartition] = useState(
    partition
      ? utils.clone(partition)
      : {
          type: null,
          magnitude: null,
          quantity: null,
        }
  );

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempPartition);
  }

  function CheckFinalButtonValid() {
    if (!tempPartition.type || !tempPartition.magnitude || !tempPartition.quantity) {
      return false;
    }

    return true;
  }

  return (
    <Modal title="Partição" className="ModalManagePartition-container" onClickToClose={onClose}>
      <div className="new-partition-wrapper">
        <Select
          label={"Tipo"}
          extraWidth={250}
          value={tempPartition}
          valuePropertyPath="type"
          onSelect={setTempPartition}
          options={lc.partitionTypes.filter((f) => f.value === partition?.type || !partitions.some((r) => r.type === f.value))}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Magnitude"}
          extraWidth={250}
          value={tempPartition}
          valuePropertyPath="magnitude"
          onSelect={setTempPartition}
          options={lc.partitionMagnitudes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <Select
          label={"Quantidade"}
          extraWidth={250}
          value={tempPartition}
          valuePropertyPath="quantity"
          onSelect={setTempPartition}
          options={lc.partitionQuantities}
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

export default ModalManagePartition;
