import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListDistributionsByResponseHeadersPolicyIdCommand,
} from "@aws-sdk/client-cloudfront";

const listDistributionsByResponseHeadersPolicyId: AppBlock = {
  name: "List Distributions By Response Headers Policy Id",
  description:
    "Gets a list of distribution IDs for distributions that have a cache behavior that's associated with the specified response headers policy.",
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
            "The maximum number of distribution IDs that you want to get in the response.",
          type: "number",
          required: false,
        },
        ResponseHeadersPolicyId: {
          name: "Response Headers Policy Id",
          description:
            "The ID of the response headers policy whose associated distribution IDs you want to list.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListDistributionsByResponseHeadersPolicyIdCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Distributions By Response Headers Policy Id Result",
      description:
        "Result from ListDistributionsByResponseHeadersPolicyId operation",
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

export default listDistributionsByResponseHeadersPolicyId;
