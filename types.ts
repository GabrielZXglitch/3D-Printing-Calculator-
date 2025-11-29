export interface CostData {
  // Part Info
  partName: string;
  printTime: number | string; // hours
  partWeight: number | string; // grams

  // Material & Energy
  filamentCost: number | string; // R$/kg
  printerPower: number | string; // Watts
  kwhCost: number | string; // R$/kWh

  // Packaging & Fixed
  packagingRollCost: number | string; // R$
  bagsPerRoll: number | string;
  monthlyProduction: number | string; // units
  monthlyFixedCost: number | string; // R$

  // Depreciation
  printerValue: number | string; // R$
  printerLifespan: number | string; // hours

  // Rates & Taxes
  failureRate: number | string; // %
  taxRate: number | string; // %
  cardFee: number | string; // %
  adCost: number | string; // %
  markup: number | string; // multiplier
}

export interface CalculatedResults {
  filamentPrice: number;
  energyConsumption: number;
  energyPrice: number;
  packagingPrice: number;
  fixedCostPerUnit: number;
  depreciationPrice: number;
  subtotal: number;
  failurePrice: number;
  totalBaseCost: number;
  
  sellingPrice: number;
  
  taxValue: number;
  cardValue: number;
  adValue: number;
  
  grossProfit: number; // Selling Price - Base Cost
  netProfit: number; // Gross Profit - Taxes/Fees
}