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
      <div className={`${className}`}>
        <Panel title={title} info={info}>
          {children}
        </Panel>
      </div>
    </div>
  );
}

export default Modal;
