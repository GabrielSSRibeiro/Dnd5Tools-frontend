import React from "react";
import { useAuth } from "../../contexts/Auth";
import { useHistory } from "react-router-dom";
//  import api from "../../services/api";

import { turnValueIntoPercentageString as percentage } from "../../utils";
import { MIN_DIFICULTY } from "../../Tables/skillCheck";
import { UNCOMMON_ITEM_MIN_PRICE, PRIMARY_AFIX_PROB, SECONDARY_AFIX_PROB, CURSE_AFIX_PROB } from "../../Tables/treasure";

import Button from "../Button";
import Panel from "../Panel";

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
        <div className="modal-body">
          <Panel title="Teste">
            <div className="panel-body">
              <h5>Dificuldade mínima: {MIN_DIFICULTY}</h5>
            </div>
          </Panel>
          <Panel title="Tesouro">
            <div className="panel-body">
              <h5>Preço mínimo de item incomum: {UNCOMMON_ITEM_MIN_PRICE} PO</h5>
              <h5>Probabilidade de afixo primário em item: {percentage(PRIMARY_AFIX_PROB)}</h5>
              <h5>Probabilidade de afixo secundário em item: {percentage(SECONDARY_AFIX_PROB)}</h5>
              <h5>Probabilidade de afixo amaldiçoado em item: {percentage(CURSE_AFIX_PROB)}</h5>
            </div>
          </Panel>
        </div>
        <footer>
          <Button text="Sair" onClick={HandleLogout} />
        </footer>
      </main>
    </div>
  );
}

export default MenuModal;
