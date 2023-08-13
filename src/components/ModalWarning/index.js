import React from "react";

import Modal from "../Modal";
import Button from "../Button";

import "./styles.css";

function ModalWarning({ title = "", message = "", actions = [] }) {
  return (
    <Modal title={title} className="ModalWarning-container" onClickToClose={actions.length === 1 ? actions[0].click : () => {}}>
      {message && <span className="warning-message">{message}</span>}
      <footer className="warning-actions-wrapper">
        {actions.map((a, index) =>
          a.isSimple ? (
            <button className="button-simple" onClick={a.click} key={index}>
              {a.text}
            </button>
          ) : (
            <Button text={a.text} onClick={a.click} key={index} />
          )
        )}
      </footer>
    </Modal>
  );
}

export default ModalWarning;
