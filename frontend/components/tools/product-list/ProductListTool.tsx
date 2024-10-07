"use client";

import { ProductList } from "./product-list";
import { makeAssistantToolUI } from "@assistant-ui/react";

type ProductListToolArgs = {};
type ProductListToolResult = {
  product_details: {
    productId: string;
    productName: string;
    manufacturer: string;
    efficiency: number;
    warrantyYears: number;
    powerOutput: number;
    dimensions: string;
    productDescription: string;
  };
}[];

export const ProductListTool = makeAssistantToolUI<
  ProductListToolArgs,
  string
>({
  toolName: "product_list",
  render: function ProductListUI({ part: { result } }) {
    let resultObj: ProductListToolResult | { error: string };
    try {
      resultObj = result ? JSON.parse(result) : {};
    } catch (e) {
      resultObj = { error: result! };
    }

    return (
      <div className="mb-4 flex flex-col items-center gap-2">
        <pre className="whitespace-pre-wrap break-all text-center">
          product_list()
        </pre>
        {Array.isArray(resultObj) && (
          <ProductList products={resultObj.map(item => item.product_details)} />
        )}
        {"error" in resultObj && (
          <p className="text-red-500">{resultObj.error}</p>
        )}
      </div>
    );
  },
});
