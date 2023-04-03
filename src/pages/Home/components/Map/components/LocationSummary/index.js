import React, { useState } from "react";

import "./styles.css";

import ModalEditLocation from "../ModalEditLocation";

function LocationSummary({ location }) {
  const [modal, setModal] = useState(null);

  function OpenModalEditLocation(location) {
    setModal(<ModalEditLocation location={location} onClose={(tempLocation) => HandleCloseModalEditLocation(location, tempLocation)} />);
  }
  function HandleCloseModalEditLocation(location, tempLocation) {
    if (tempLocation) {
    }

    setModal(null);
  }

  return (
    <div className="LocationSummary-container">
      {modal}
      <header className="header">
        <aside className="header-action">
          <button onClick={() => OpenModalEditLocation()}>
            <i class="fas fa-plus"></i>
          </button>
        </aside>
        <span className="name">Nome</span>
        <aside className="header-details">
          <button>
            <i class="fas fa-book"></i>
          </button>
        </aside>
      </header>
      <footer className="details">
        <span className="first-impressions">Primeiras Impressoes</span>
        <div className="divider"></div>
        <div className="creature-list">
          <div className="creature-avatar">C1</div>
          <div className="creature-avatar">C2</div>
          <div className="creature-avatar">C3</div>
        </div>
      </footer>
    </div>
  );
}

export default LocationSummary;
