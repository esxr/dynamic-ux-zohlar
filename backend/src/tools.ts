import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { tool } from "@langchain/core/tools";
import {
  ProductDetailsResponse,
  PricingResponse,
  InstallationAvailabilityResponse,
  SavingsEstimatesResponse,
  IncentivesResponse,
  PurchaseResponse,
  ProductListResponse,
} from "types.js";
import { z } from "zod";

export async function callSolarCompanyAPI<
  Output extends Record<string, any> = Record<string, any>
>(fields: {
  endpoint: string;
  params: Record<string, string>;
}): Promise<Output> {
  if (!process.env.SOLAR_COMPANY_API_KEY) {
    throw new Error("SOLAR_COMPANY_API_KEY is not set");
  }

  const baseURL = "https://augment.ngrok.io";
  const queryParams = new URLSearchParams(fields.params).toString();
  const url = `${baseURL}${fields.endpoint}?${queryParams}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-API-KEY": process.env.SOLAR_COMPANY_API_KEY,
    },
  });

  if (!response.ok) {
    let res: string;
    try {
      res = JSON.stringify(await response.json(), null, 2);
    } catch (_) {
      try {
        res = await response.text();
      } catch (_) {
        res = response.statusText;
      }
    }
    throw new Error(
      `Failed to fetch data from ${fields.endpoint}.\nResponse: ${res}`
    );
  }
  const data = await response.json();
  return data;
}

export const productListTool = tool(
  async () => {
    try {
      const data = await callSolarCompanyAPI<ProductListResponse>({
        endpoint: "/products/list",
        params: {},
      });
      return JSON.stringify(data, null);
    } catch (e: any) {
      console.warn("Error fetching product list", e.message);
      return `An error occurred while fetching product list: ${e.message}`;
    }
  },
  {
    name: "product_list",
    description:
      "Fetches a list of all available solar products. The output includes an array of products with details such as name, manufacturer, efficiency, and other relevant specifications.",
    schema: z.object({}), // No parameters are required
  }
);


export const productDetailsTool = tool(
  async (input) => {
    try {
      const data = await callSolarCompanyAPI<ProductDetailsResponse>({
        endpoint: "/products/details",
        params: {
          productName: input.productName,
        },
      });
      return JSON.stringify(data, null);
    } catch (e: any) {
      console.warn("Error fetching product details", e.message);
      return `An error occurred while fetching product details: ${e.message}`;
    }
  },
  {
    name: "product_details",
    description:
      "Fetches details about a specific solar product. The output includes key information such as product specifications, manufacturer, and performance ratings.",
    schema: z.object({
      productName: z.string().describe("The name of the solar product."),
    }),
  }
);

export const pricingTool = tool(
  async (input) => {
    try {
      const data = await callSolarCompanyAPI<PricingResponse>({
        endpoint: "/products/pricing",
        params: {
          productId: input.productId,
        },
      });
      return JSON.stringify(data, null);
    } catch (e: any) {
      console.warn("Error fetching product pricing", e.message);
      return `An error occurred while fetching product pricing: ${e.message}`;
    }
  },
  {
    name: "product_pricing",
    description:
      "Retrieves pricing information for a specific solar product, including base cost and available financing options.",
    schema: z.object({
      productId: z.string().describe("The ID of the solar product."),
    }),
  }
);

export const installationAvailabilityTool = tool(
  async (input) => {
    try {
      if (!input.preferredDate) return JSON.stringify(null);
      const data = await callSolarCompanyAPI<InstallationAvailabilityResponse>({
        endpoint: "/installation/availability",
        params: {
          zipCode: input.zipCode,
          preferredDate: input.preferredDate,
        },
      });
      return JSON.stringify(data, null);
    } catch (e: any) {
      console.warn("Error fetching installation availability", e.message);
      return `An error occurred while fetching installation availability: ${e.message}`;
    }
  },
  {
    name: "installation_availability",
    description:
      "Checks installation availability for a given location and preferred date.",
    schema: z.object({
      zipCode: z.string().describe("The zip code of the installation location."),
      preferredDate: z.string().optional().describe("Preferred installation date."),
    }),
  }
);

export const savingsEstimatesTool = tool(
  async (input) => {
    try {
      const data = await callSolarCompanyAPI<SavingsEstimatesResponse>({
        endpoint: "/estimate/savings",
        params: {
          location: input.location,
          usage: input.usage.toString(),
          panelCapacity: input.panelCapacity.toString(),
        },
      });
      return JSON.stringify(data, null);
    } catch (e: any) {
      console.warn("Error fetching savings estimates", e.message);
      return `An error occurred while fetching savings estimates: ${e.message}`;
    }
  },
  {
    name: "savings_estimates",
    description:
      "Provides estimated savings for a specific solar panel installation based on location, energy usage, and panel capacity.",
    schema: z.object({
      location: z.string().describe("The user's location."),
      usage: z.number().positive().describe("The user's energy usage in kWh."),
      panelCapacity: z
        .number()
        .positive()
        .describe("The capacity of the solar panel in kW."),
    }),
  }
);

export const incentivesTool = tool(
  async (input) => {
    try {
      const data = await callSolarCompanyAPI<IncentivesResponse>({
        endpoint: "/incentives",
        params: {
          state: input.state,
        },
      });
      return JSON.stringify(data, null);
    } catch (e: any) {
      console.warn("Error fetching solar incentives", e.message);
      return `An error occurred while fetching solar incentives: ${e.message}`;
    }
  },
  {
    name: "solar_incentives",
    description:
      "Fetches available solar incentives and tax benefits based on the user's state or location.",
    schema: z.object({
      state: z.string().describe("The state for which to fetch incentives."),
    }),
  }
);

export const purchaseProductTool = tool(
  (input) => {
    return (
      `Please confirm that you want to purchase ${input.quantity} unit(s) of ${input.productId} at ` +
      `${input.maxPurchasePrice
        ? `$${input.maxPurchasePrice} per unit`
        : "the current price"
      }.`
    );
  },
  {
    name: "purchase_product",
    description:
      "This tool should be called when a user wants to purchase a solar product.",
    schema: z.object({
      productId: z
        .string()
        .optional()
        .describe("The ID of the solar product."),
      productName: z
        .string()
        .optional()
        .describe(
          "The name of the solar product. This field should be populated if you do not know the product ID."
        ),
      quantity: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("The quantity of the product to purchase. Defaults to 1."),
      maxPurchasePrice: z
        .number()
        .positive()
        .optional()
        .describe(
          "The max price at which to purchase the product. Defaults to the current price."
        ),
    }),
  }
);

// export const webSearchTool = new TavilySearchResults({
//   maxResults: 2,
// });

export const webSearchTool = new DuckDuckGoSearch({
  maxResults: 1,
});

export const ALL_TOOLS_LIST = [
  productListTool,
  productDetailsTool,
  pricingTool,
  installationAvailabilityTool,
  savingsEstimatesTool,
  incentivesTool,
  purchaseProductTool,
  webSearchTool,
];

export const SIMPLE_TOOLS_LIST = [
  productListTool,
  productDetailsTool,
  pricingTool,
  installationAvailabilityTool,
  savingsEstimatesTool,
  incentivesTool,
  webSearchTool,
];
