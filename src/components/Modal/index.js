import React from "react";

import Panel from "../Panel";

import "./styles.css";

function Modal({ title, info, onClickToClose, className = "", children }) {
  function HandleClose() {
    onClickToClose();
  }

  return (
    <div className="Modal-container">
      <div className="screen-block" onClick={onClickToClose ? HandleClose : () => {}}></div>
      <Panel title={title} info={info} className={`modal-body ${className}`}>
        {children}
      </Panel>
    </div>
  );
}

export default Modal;
