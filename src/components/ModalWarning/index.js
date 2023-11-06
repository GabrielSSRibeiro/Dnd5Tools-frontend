import React from "react";

import Modal from "../Modal";
import Button from "../Button";

import "./styles.css";

function ModalWarning({ title = "", messages = [], actions = [], children }) {
  return (
    <Modal title={title} className="ModalWarning-container" onClickToClose={actions.length === 1 ? actions[0].click : () => {}}>
      {messages.length > 0 && (
        <div className="messages-wrapper df df-fd-c df-jc-fs">
          {messages.map((message, index) => (
            <span className="warning-message" key={index}>
              {message}
            </span>
          ))}
          {children}
        </div>
      )}
      <footer className="warning-actions-wrapper">
        {actions.map((a, index) =>
          a.isSimple ? (
            <button
              className={`df df-cg-5 button-simple${a.className ? ` ${a.className}` : ""}${a.disabled ? " element-disabled" : ""}`}
              onClick={a.click}
              disabled={a.disabled}
              key={index}
            >
              {a.icon && <i className={a.icon}></i>}
              {a.text}
            </button>
          ) : (
            <Button text={a.text} icon={a.icon} onClick={a.click} key={index} />
          )
        )}
      </footer>
    </Modal>
  );
}

export default ModalWarning;
