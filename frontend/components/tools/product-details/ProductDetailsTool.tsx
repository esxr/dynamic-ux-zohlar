"use client";

import { ProductDetailsCard } from "./product-details";
import { makeAssistantToolUI } from "@assistant-ui/react";

type ProductDetailsToolArgs = {
  productId: string;
};

type ProductDetailsToolResult = {
  product: {
    productId: string;
    productName: string;
    manufacturer: string;
    efficiency: number;
    warrantyYears: number;
    powerOutput: number;
    dimensions: string;
    productDescription: string;
  };
};

export const ProductDetailsTool = makeAssistantToolUI<
  ProductDetailsToolArgs,
  string
>({
  toolName: "product_details",
  render: function ProductDetailsUI({ part: { args, result } }) {
    let resultObj: ProductDetailsToolResult | { error: string };
    try {
      resultObj = result ? JSON.parse(result) : {};
    } catch (e) {
      resultObj = { error: result! };
    }

    return (
      <div className="mb-4 flex flex-col items-center gap-2">
        <pre className="whitespace-pre-wrap break-all text-center">
          product_details({JSON.stringify(args)})
        </pre>
        {"product" in resultObj && (
          <ProductDetailsCard {...resultObj.product} />
        )}
        {"error" in resultObj && (
          <p className="text-red-500">{resultObj.error}</p>
        )}
      </div>
    );
  },
});
