import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListDistributionsByKeyGroupCommand,
} from "@aws-sdk/client-cloudfront";

const listDistributionsByKeyGroup: AppBlock = {
  name: "List Distributions By Key Group",
  description:
    "Gets a list of distribution IDs for distributions that have a cache behavior that references the specified key group.",
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
        KeyGroupId: {
          name: "Key Group Id",
          description:
            "The ID of the key group whose associated distribution IDs you are listing.",
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

        const command = new ListDistributionsByKeyGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Distributions By Key Group Result",
      description: "Result from ListDistributionsByKeyGroup operation",
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

export default listDistributionsByKeyGroup;
