import { ToolNode } from "@langchain/langgraph/prebuilt";
import {
  Annotation,
  END,
  START,
  StateGraph,
  NodeInterrupt,
  MessagesAnnotation,
} from "@langchain/langgraph";
import {
  BaseMessage,
  ToolMessage,
  type AIMessage,
} from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import {
  pricingTool,
  purchaseProductTool,
  ALL_TOOLS_LIST,
  webSearchTool,
  callSolarCompanyAPI,
  productListTool,
} from "tools.js";
import { z } from "zod";
import { ProductDetails, ProductDetailsResponse, ProductPurchase } from "types.js";


const GraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  requestedProductPurchaseDetails: Annotation<ProductPurchase>,
  suitableProductDetails: Annotation<ProductDetails>,
});

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});

const toolNode = new ToolNode(ALL_TOOLS_LIST);

const callModel = async (state: typeof GraphAnnotation.State) => {
  const { messages } = state;

  const systemMessage = {
    role: "system",
    content:
      "You are a solar energy expert specializing in helping users select, purchase, and manage solar energy products. " +
      "You have access to a range of tools that can assist with tasks such as fetching product details, pricing, installation availability, " +
      "estimating potential energy savings, and finding available solar incentives. " +
      "When answering user questions, use the appropriate tool to retrieve accurate and relevant information. " +
      "For example, use the 'product_list' tool to fetch a list of available solar products when a user is browsing for suitable products, " +
      "or DOESN'T LIST a specific product, or just lists an example. " +
      "Use the 'product_details' tool to find specific information about a product when a user wants to make a purchase or learn more about a particular solar product. " +
      "Additionally, assist users in placing purchases by guiding them through product selection, quantity, and pricing details please."
  };

  const llmWithTools = llm.bindTools(ALL_TOOLS_LIST);
  const result = await llmWithTools.invoke([systemMessage, ...messages]);
  return { messages: result };
};

const shouldContinue = (state: typeof GraphAnnotation.State) => {
  const { messages, requestedProductPurchaseDetails } = state;

  const lastMessage = messages[messages.length - 1];

  const messageCastAI = lastMessage as AIMessage;
  if (messageCastAI._getType() !== "ai" || !messageCastAI.tool_calls?.length) {
    return END;
  }

  // Find if the last message is about executing a purchase
  if (requestedProductPurchaseDetails) {
    return "execute_purchase";
  }

  // Find if the last message is about purchasing
  const purchaseProductTool = messageCastAI.tool_calls.find(
    (tc) => tc.name === "purchase_product"
  );
  if (purchaseProductTool) {
    return "prepare_purchase_details";
  }

  // If the last message is about finding a suitable product
  // const productListTool = messageCastAI.tool_calls.find(
  //   (tc) => tc.name === "product_list"
  // );
  // if (productListTool) {
  //   return "find_suitable_product";
  // }

  const { tool_calls } = messageCastAI;
  if (!tool_calls?.length) {
    throw new Error(
      "Expected tool_calls to be an array with at least one element"
    );
  }

  return tool_calls.map((tc) => {
    if (tc.name === "product_list") {

      // TODO: fix this
      // return "find_suitable_product";
      return "tools";
    } else {
      return "tools";
    }
    // console.log(tc.name)
    // return "tools";
  });
};

const findSuitableProduct = async (state: typeof GraphAnnotation.State) => {
  const { messages } = state;

  const lastMessage = messages[messages.length - 1];

  // Find the query for the product from the last AI message using an LLM invoke
  const messageCastAI = lastMessage as AIMessage;
  if (messageCastAI._getType() !== "ai") {
    throw new Error("Expected the last message to be an AI message");
  }
  const messageContent = messageCastAI.content as string;
  const searchQuery = await llm.invoke(
    `Given the following context, create a search query to find a suitable solar panel: (less than 10 words)\n${messageContent}`
  );

  // Use the search query to find the specs for the given solar panel
  const searchResults = await webSearchTool.invoke(`${searchQuery}`);
  // const searchResults = await llm.withStructuredOutput(
  //   z
  //     .object({
  //       productID: z.string(),
  //       productName: z.string(),
  //       manufacturer: z.string(),
  //       efficiency: z.number(),
  //       warrantyYears: z.number(),
  //       powerOutput: z.number(),
  //       dimensions: z.string(),
  //       productDescription: z.string(),
  //     })
  //     .describe(
  //       `Extract the solar panel data from the given search.`
  //     ),
  //     { name: "extract_product" }
  // );
  
  // Get a list of products from our API
  const productList = await productListTool.invoke({})

  // Find the product from our company that best matches the search results
  const llmWithProductDetails = await llm.withStructuredOutput(
    z.object({
      productID: z.string(),
      productName: z.string(),
      manufacturer: z.string(),
      efficiency: z.number(),
      warrantyYears: z.number(),
      powerOutput: z.number(),
      dimensions: z.string(),
      productDescription: z.string(),
    })
  );

  const _suitableProductDetails = await llmWithProductDetails.invoke([
    {
      role: "user",
      content: `Given a product list, and a target example product, find the most appropriate product from the list which resembles the target example product.\n\n---\nTARGET EXAMPLE PRODUCT\n---\n\n${searchResults}\n\n---\nPRODUCT LIST\n---\n\n${productList}\n`,
    }
  ]);

  return {
    suitableProductDetails: _suitableProductDetails,
  };
};

const preparePurchaseDetails = async (state: typeof GraphAnnotation.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  if (lastMessage._getType() !== "ai") {
    throw new Error("Expected the last message to be an AI message");
  }

  const messageCastAI = lastMessage as AIMessage;
  const purchaseProductTool = messageCastAI.tool_calls?.find(
    (tc) => tc.name === "purchase_product"
  );
  if (!purchaseProductTool) {
    throw new Error(
      "Expected the last AI message to have a purchase_product tool call"
    );
  }
  let { maxPurchasePrice, productName, productDetails } = purchaseProductTool.args;

  if (!productDetails) {
    if (!productName) {
      const toolMessages = messageCastAI.tool_calls?.map((tc) => {
        return {
          role: "tool",
          content: `Please provide the missing information for the ${tc.name} tool.`,
          id: tc.id,
        };
      });

      return {
        messages: [
          ...(toolMessages ?? []),
          {
            role: "assistant",
            content:
              "Please provide either the product details or the product name to purchase.",
          },
        ],
      };
    } else {
      productDetails = await findSuitableProduct(purchaseProductTool.args.productName);
    }
  }

  if (!maxPurchasePrice) {
    const priceSnapshot = await pricingTool.invoke({ productId: productDetails });
    maxPurchasePrice = priceSnapshot.snapshot.price;
  }

  return {
    requestedProductPurchaseDetails: {
      productDetails,
      quantity: purchaseProductTool.args.quantity ?? 1,
      maxPurchasePrice,
    },
  };
};

const purchaseApproval = async (state: typeof GraphAnnotation.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  if (!(lastMessage instanceof ToolMessage)) {
    throw new NodeInterrupt("Please confirm the purchase before executing.");
  }
};

const shouldExecute = (state: typeof GraphAnnotation.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  if (!(lastMessage instanceof ToolMessage)) {
    throw new NodeInterrupt("Please confirm the purchase before executing.");
  }

  const { approve } = JSON.parse(lastMessage.content as string);
  return approve ? "execute_purchase" : "agent";
};

const executePurchase = async (state: typeof GraphAnnotation.State) => {
  const { requestedProductPurchaseDetails } = state;
  if (!requestedProductPurchaseDetails) {
    throw new Error("Expected requestedProductPurchaseDetails to be present");
  }

  const { productDetails, quantity, maxPurchasePrice } = requestedProductPurchaseDetails;

  const toolCallId = "tool_" + Math.random().toString(36).substring(2);
  return {
    messages: [
      {
        type: "ai",
        tool_calls: [
          {
            name: "execute_purchase",
            id: toolCallId,
            args: {
              productDetails,
              quantity,
              maxPurchasePrice,
            },
          },
        ],
      },
      {
        type: "tool",
        name: "execute_purchase",
        tool_call_id: toolCallId,
        content: JSON.stringify({
          success: true,
        }),
      },
      {
        type: "ai",
        content:
          `Successfully purchased ${quantity} unit(s) of ` +
          `${productDetails} at $${maxPurchasePrice}/unit.`,
      },
    ],
  };
};

const workflow = new StateGraph(GraphAnnotation)
  .addNode("agent", callModel)
  .addEdge(START, "agent")
  .addNode("tools", toolNode)
  .addNode("prepare_purchase_details", preparePurchaseDetails)
  .addNode("purchase_approval", purchaseApproval)
  .addNode("execute_purchase", executePurchase)
  .addNode("find_suitable_product", findSuitableProduct)

  .addEdge("prepare_purchase_details", "purchase_approval")
  .addEdge("execute_purchase", END)

  .addEdge("tools", "agent")
  .addEdge("find_suitable_product", "agent")

  .addConditionalEdges("purchase_approval", shouldExecute, [
    "agent",
    "execute_purchase",
  ])

  .addConditionalEdges("agent", shouldContinue, [
    "tools",
    END,
    "prepare_purchase_details",
    "find_suitable_product",
  ])

export const graph = workflow.compile({});
