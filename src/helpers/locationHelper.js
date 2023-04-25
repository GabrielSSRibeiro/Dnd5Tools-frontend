import * as utils from "../utils";
import * as lc from "../constants/locationConstants";

export const GetRadius = (size) => {
  if (size == null) {
    return null;
  }

  const baseValue = lc.GetLocationSize(size).baseRadiusMultiplier;
  const variance = 0.1;

  return utils.randomValueFromVariancePercentage(baseValue * 100, variance) / 100;
};
