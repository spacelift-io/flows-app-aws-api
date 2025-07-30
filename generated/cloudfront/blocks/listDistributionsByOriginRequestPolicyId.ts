import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListDistributionsByOriginRequestPolicyIdCommand,
} from "@aws-sdk/client-cloudfront";

const listDistributionsByOriginRequestPolicyId: AppBlock = {
  name: "List Distributions By Origin Request Policy Id",
  description:
    "Gets a list of distribution IDs for distributions that have a cache behavior that's associated with the specified origin request policy.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this field when paginating results to indicate where to begin in your list of distribution IDs.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of distribution IDs that you want in the response.",
          type: "number",
          required: false,
        },
        OriginRequestPolicyId: {
          name: "Origin Request Policy Id",
          description:
            "The ID of the origin request policy whose associated distribution IDs you want to list.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListDistributionsByOriginRequestPolicyIdCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Distributions By Origin Request Policy Id Result",
      description:
        "Result from ListDistributionsByOriginRequestPolicyId operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DistributionIdList: {
            type: "object",
            properties: {
              Marker: {
                type: "string",
              },
              NextMarker: {
                type: "string",
              },
              MaxItems: {
                type: "number",
              },
              IsTruncated: {
                type: "boolean",
              },
              Quantity: {
                type: "number",
              },
              Items: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["Marker", "MaxItems", "IsTruncated", "Quantity"],
            additionalProperties: false,
            description: "A list of distribution IDs.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listDistributionsByOriginRequestPolicyId;
