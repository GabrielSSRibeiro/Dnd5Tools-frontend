import * as creatureConstants from "../constants/creatureConstants";

export const GetAttributeValue = (attribute) => {
  return creatureConstants.creatureAttributes.find((a) => a.value === attribute).value;
};
