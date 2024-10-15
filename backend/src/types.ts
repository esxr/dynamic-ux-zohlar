/**
 * ----------------------------------------------------
 * ------------------ /products/list ------------------
 * ----------------------------------------------------
 */
export interface ProductListResponse {
  products: ProductDetails[]; // List of product details
}


/**
 * ----------------------------------------------------
 * ------------------ /products/details ------------------
 * ----------------------------------------------------
 */
export interface ProductDetails {
  productId: string;
  productName: string;
  manufacturer: string;
  efficiency: number; // Efficiency of the solar product in percentage
  warrantyYears: number;
  powerOutput: number; // Power output in kW
  dimensions: string; // Dimensions of the solar panel or product
  productDescription: string;
}

export interface ProductDetailsResponse {
  product_details: ProductDetails;
}

/**
 * ----------------------------------------------------
 * ------------------ /products/pricing ------------------
 * ----------------------------------------------------
 */
export interface Pricing {
  productId: string;
  basePrice: number;
  availableFinancing: boolean;
  financingOptions: string[];
}

export interface PricingResponse {
  pricing: Pricing;
}

export interface FinancingOption {
  optionId: string;
  type: string; // loan, lease, payment_plan
  description: string;
  terms: string; // e.g., "60 months"
  interestRate: number; // in percentage
  monthlyPayment: number; // in dollars
  totalCost: number; // total cost in dollars
}

export interface FinancingOptionsResponse {
  financingOptions: FinancingOption[];
}


/**
 * ----------------------------------------------------
 * ------------ /installation/availability --------------
 * ----------------------------------------------------
 */
export interface InstallationAvailability {
  zipCode: string;
  availableDates: string[]; // Array of available installation dates
  preferredDate?: string; // User's preferred installation date
}

export interface InstallationAvailabilityResponse {
  installation_availability: InstallationAvailability;
}

/**
 * ----------------------------------------------------
 * ----------- /estimate/savings -----------
 * ----------------------------------------------------
 */
export interface SavingsEstimates {
  estimatedSavings: number; // Estimated savings in dollars
  energyOffset: number; // Energy offset in percentage
  paybackPeriodYears: number; // Payback period in years
}

export interface SavingsEstimatesResponse {
  savings_estimates: SavingsEstimates;
}

/**
 * ----------------------------------------------------
 * ------------- /incentives --------------
 * ----------------------------------------------------
 */
export interface Incentives {
  state: string;
  federalIncentive: string; // Federal incentives available
  stateIncentive: string; // State-specific incentives
  rebateProgram: string; // Local rebate programs
  taxCreditPercentage: number; // Percentage of tax credit available
}

export interface IncentivesResponse {
  incentives: Incentives;
}

/**
 * ----------------------------------------------------
 * --------- /purchase/confirmation ---------
 * ----------------------------------------------------
 */
export interface Purchase {
  productId: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  confirmationMessage: string; // Confirmation message post-purchase
}

export interface PurchaseResponse {
  purchase: Purchase;
}

/**
 * ----------------------------------------------------
 * --------- /prices/snapshot ---------
 * ----------------------------------------------------
 */
export interface Snapshot {
  price: number;
  productId: string;
  day_change: number;
  day_change_percent: number;
  time: string;
  time_nanoseconds: number;
}

export interface SnapshotResponse {
  snapshot: Snapshot;
}

/**
 * ----------------------------------------------------
 * --------- ProductPurchase type definition ---------
 * ----------------------------------------------------
 */
export interface ProductPurchase {
  productDetails: string; // The product details, typically the productId
  quantity: number; // The quantity to purchase
  maxPurchasePrice: number; // The maximum price the user is willing to pay per unit
}

/* ---------------------------------------------------- */
