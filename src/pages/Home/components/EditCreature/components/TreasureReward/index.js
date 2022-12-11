import React from "react";

import {
  TREASURE_TYPES,
  treasureTypes,
  goldPiecesQuantities,
  EQUIPMENT_TYPES,
  equipmentTypes,
  equipmentRarities,
} from "../../../../../../data/treasureConstants";

import Select from "../../../../../../components/Select";

import "./styles.css";

function TreasureReward({ creature, setCreature }) {
  return (
    <div className="TreasureReward-container">
      <h2>Tesouro</h2>
      <Select
        label={"Tipo"}
        extraWidth={100}
        value={creature}
        valuePropertyPath="treasure.type"
        onSelect={setCreature}
        nothingSelected="Nenhum"
        options={treasureTypes}
        optionDisplay={(o) => o.display}
        optionValue={(o) => o.value}
      />
      {creature.treasure.type === TREASURE_TYPES.GOLD_PIECES && (
        <Select
          label={"Quantidade"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="treasure.goldPieces.quantity"
          onSelect={setCreature}
          nothingSelected="Nenhum"
          options={goldPiecesQuantities}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
      )}
      {creature.treasure.type === TREASURE_TYPES.MATERIAL && (
        <Select
          label={"Raridade"}
          extraWidth={100}
          value={creature}
          valuePropertyPath="treasure.material.rarity"
          onSelect={setCreature}
          nothingSelected="Nenhum"
          options={equipmentRarities}
          optionDisplay={(o) => o.display}
          optionValue={(o) => o.value}
        />
      )}
      {creature.treasure.type === TREASURE_TYPES.EQUIPMENT && (
        <div className="equipment-details">
          <Select
            label={"Raridade"}
            extraWidth={100}
            value={creature}
            valuePropertyPath="treasure.equipment.rarity"
            onSelect={setCreature}
            nothingSelected="Nenhum"
            options={equipmentRarities}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
          />
          <Select
            label={"Tipo do Item"}
            extraWidth={100}
            value={creature}
            valuePropertyPath="treasure.equipment.type"
            onSelect={setCreature}
            nothingSelected="Nenhum"
            options={equipmentTypes}
            optionDisplay={(o) => o.display}
            optionValue={(o) => o.value}
          />
          {creature.treasure.equipment.type === EQUIPMENT_TYPES.WEAPON && (
            <Select
              label={"Tipo de Possível Dano"}
              extraWidth={100}
              value={creature}
              valuePropertyPath="treasure.equipment.rarity"
              onSelect={setCreature}
              nothingSelected="Nenhum"
              options={equipmentRarities}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
          )}
          {creature.treasure.equipment.type === EQUIPMENT_TYPES.ARMOR && (
            <Select
              label={"Tipo de Possível Redução"}
              extraWidth={100}
              value={creature}
              valuePropertyPath="treasure.equipment.rarity"
              onSelect={setCreature}
              nothingSelected="Nenhum"
              options={equipmentRarities}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
          )}
          {creature.treasure.equipment.type === EQUIPMENT_TYPES.JEWELRY && (
            <Select
              label={"Atributo de Possível Bônus"}
              extraWidth={100}
              value={creature}
              valuePropertyPath="treasure.equipment.rarity"
              onSelect={setCreature}
              nothingSelected="Nenhum"
              options={equipmentRarities}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
          )}
          {creature.treasure.equipment.type === EQUIPMENT_TYPES.POTION && (
            <Select
              label={"Atributo de Possível Bônus"}
              extraWidth={100}
              value={creature}
              valuePropertyPath="treasure.equipment.rarity"
              onSelect={setCreature}
              nothingSelected="Nenhum"
              options={equipmentRarities}
              optionDisplay={(o) => o.display}
              optionValue={(o) => o.value}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default TreasureReward;
