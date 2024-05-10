import React, { useState } from "react";

import { systemTypes } from "../../../../constants/combatConstants";

import Modal from "../../../Modal";
import Button from "../../../Button";
import Select from "../../../Select";

import "./styles.css";

function ModalSettings({ combatConfig, onClickToClose, HandleSaveCombatConfig, HandleLogout }) {
  const [systemType, setSystemType] = useState(combatConfig.systemType);

  function HandleSave() {
    combatConfig.systemType = systemType;
    HandleSaveCombatConfig();
    onClickToClose();
  }

  return (
    <Modal title="Versao 2.0" className="ModalSettings-container" onClickToClose={onClickToClose}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p>Motivaçoes</p>
        <span>Subir o piso de mestrar uma sessao. Rapido de criar, facil de editar</span>
        <span>Criar e gerenciar um mundo</span>
        <span>Abstrair o processo de criacao de criaturas, o tornando subjetivo e simples</span>
        <span>
          A ficha de uma criatura é, e deveria ser, desconhecida pelos jogadores, logo algumas liberdades podem ser tomadas durante a criaçao
        </span>
        <span>
          Descriçoes excessivas, recargas, multiataque, magias, ações bonus, ações lendárias, e outros foram simplificados para facilitar o controle
          de criaturas
        </span>
        <span>Ter um sistema de forja de items</span>
        <span>Acrescentar novas opcoes táticas ao combate como Pontos Fracos, Comportamentos, e raridade de açoes</span>
        <p>-</p>
        <p>Notas</p>
        <span>No Foundry, ficha de criatura recomendada: "Monster Blocks"</span>
        <span>No Foundry, Pontos Fracos estao junto ao PV na ficha e opcoes de Compartamento estao em Efeitos</span>
        <span>No Foundry, módulo de controle de criatura recomendado: "Argon Combat HUD"</span>
        <span>No Foundry, tokens sao genericos, por enquanto</span>
        <p>-</p>
        <p>Próximas Funcionalidades</p>
        <span>Gerenciador de Combates</span>
      </div>
      <div className="divider"></div>

      <footer className="df df-jc-sb df-cg-10">
        <Select
          value={systemType}
          onSelect={setSystemType}
          extraWidth={60}
          nothingSelected="Nenhum sistema"
          options={systemTypes}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
        <div className="df df-cg-20">
          <Button text="Sair" icon="fas fa-sign-out-alt" onClick={HandleLogout} />
          <Button text="Salvar e fechar" icon="fas fa-save" onClick={HandleSave} />
        </div>
      </footer>
    </Modal>
  );
}

export default ModalSettings;
