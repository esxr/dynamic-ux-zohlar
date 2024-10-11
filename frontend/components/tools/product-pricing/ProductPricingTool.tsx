"use client";

import { PricingList } from "./product-pricing";
import { makeAssistantToolUI } from "@assistant-ui/react";

type ProductPricingToolArgs = {};
type ProductPricingToolResult = {
  pricing: {
    productId: string;
    basePrice: number;
    availableFinancing: boolean;
    financingOptions: string[];
  };
}[];

export const ProductPricingTool = makeAssistantToolUI<
  ProductPricingToolArgs,
  string
>({
  toolName: "product_pricing",
  render: function ProductPricingUI({ part: { result } }) {
    let resultObj: ProductPricingToolResult | { error: string };
    try {
      resultObj = result ? JSON.parse(result) : {};
    } catch (e) {
      resultObj = { error: result! };
    }

    return (
      <div className="mb-4 flex flex-col items-center gap-2">
        <pre className="whitespace-pre-wrap break-all text-center">
          product_pricing()
        </pre>
        {Array.isArray(resultObj) && (
          <PricingList pricings={resultObj.map(item => item.pricing)} />
        )}
        {"error" in resultObj && (
          <p className="text-red-500">{resultObj.error}</p>
        )}
      </div>
    );
  },
});
