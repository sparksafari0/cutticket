
export type FabricType = 'self' | 'combo1' | 'combo2' | 'lining';

export const fabricLabels: Record<FabricType, string> = {
  self: 'Self',
  combo1: 'Combo 1',
  combo2: 'Combo 2',
  lining: 'Lining'
};

export const getFabricImageFieldName = (fabricType: FabricType): string => {
  return `fabric${fabricType.charAt(0).toUpperCase() + fabricType.slice(1)}Image`;
};

export const getFabricTextFieldName = (fabricType: FabricType): string => {
  return `fabric${fabricType.charAt(0).toUpperCase() + fabricType.slice(1)}Text`;
};
