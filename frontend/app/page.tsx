"use client";

import { Thread } from "@assistant-ui/react";
import { ToolFallback } from "@/components/tools/ToolFallback";
import { makeMarkdownText } from "@assistant-ui/react-markdown";
import { ProductListTool } from "@/components/tools/product-list/ProductListTool";
import { ProductDetailsTool } from "@/components/tools/product-details/ProductDetailsTool";
import { ProductPricingTool } from "@/components/tools/product-pricing/ProductPricingTool";

const MarkdownText = makeMarkdownText({});

export default function Home() {
  return (
    <div className="flex h-full flex-col">
      <Thread
        welcome={{
          suggestions: [
            {
              prompt: "I want to buy a solar panel",
            },
            {
              prompt: "What is a solar panel?",
            },
            {
              prompt: "How much do your solar panels cost?",
            },
          ],
        }}
        assistantMessage={{ components: { Text: MarkdownText, ToolFallback } }}
        tools={[ProductListTool, ProductDetailsTool, ProductPricingTool]}
      />
    </div>
  );
}
