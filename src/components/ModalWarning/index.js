import React from "react";

import Modal from "../Modal";
import Button from "../Button";

import "./styles.css";

function ModalWarning({ title = "", messages = [], actions = [] }) {
  return (
    <Modal title={title} className="ModalWarning-container" onClickToClose={actions.length === 1 ? actions[0].click : () => {}}>
      {messages.length > 0 && (
        <div className="messages-wrapper df df-fd-c">
          {messages.map((message, index) => (
            <span className="warning-message" key={index}>
              {message}
            </span>
          ))}
        </div>
      )}
      <footer className="warning-actions-wrapper">
        {actions.map((a, index) =>
          a.isSimple ? (
            <button className={`button-simple${a.className ? ` ${a.className}` : ""}`} onClick={a.click} key={index}>
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
