import React from "react";

import Panel from "../Panel";

import "./styles.css";

function Modal({ title, info, clickToClose = false, onClose = () => {}, className = "", children }) {
  function HandleClose() {
    onClose();
  }

  return (
    <div className="Modal-container">
      <div className="screen-block" onClick={clickToClose ? HandleClose : () => {}}></div>
      <Panel title={title} info={info} className={`modal-body ${className}`}>
        {children}
      </Panel>
    </div>
  );
}

export default Modal;
