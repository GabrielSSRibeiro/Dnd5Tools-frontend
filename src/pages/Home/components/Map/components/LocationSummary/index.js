import React, { useState } from "react";

import * as utils from "../../../../../../utils";

import "./styles.css";

import ModalLocationDetails from "../ModalLocationDetails";

function LocationSummary({ location, locationToEdit, setLocationToEdit }) {
  const [modal, setModal] = useState(null);

  function OpenModalLocationDetails(location) {
    setModal(<ModalLocationDetails location={location} onClose={setModal} HandleEditLocation={HandleEditLocation} />);
  }

  function HandleEditLocation() {
    setLocationToEdit(utils.clone(location));
    setModal(null);
  }

  function HandleEditNewLocation() {
    const newLocation = {};

    setLocationToEdit(newLocation);
  }

  return (
    <div className="LocationSummary-container">
      {modal}
      <header className="header">
        <aside className="header-action">
          <button onClick={HandleEditNewLocation}>
            <i class="fas fa-plus"></i>
          </button>
        </aside>
        <span className="name">Nome</span>
        <aside className="header-details">
          <button onClick={() => OpenModalLocationDetails()}>
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
