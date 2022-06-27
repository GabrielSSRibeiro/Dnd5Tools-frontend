import React from "react";
import { useAuth } from "../../contexts/Auth";
import { useHistory } from "react-router-dom";
//  import api from "../../services/api";

import Button from "../Button";

import "./styles.css";

function MenuModal({ setIsMenuOpen }) {
  const { Logout } = useAuth();
  const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  async function HandleLogout() {
    await Logout();
    history.push("/login");
  }

  function HandleClose() {
    setIsMenuOpen(false);
  }

  return (
    <div className="MenuModal-container">
      <div className="screen-block" onClick={HandleClose}></div>
      <main>
        <header>
          <h3>Menu</h3>
          <button className="modal-close" onClick={HandleClose}>
            <i class="fas fa-times"></i>
          </button>
        </header>
        <div className="modal-body"></div>
        <footer>
          <Button text="Sair" onClick={HandleLogout} />
        </footer>
      </main>
    </div>
  );
}

export default MenuModal;
