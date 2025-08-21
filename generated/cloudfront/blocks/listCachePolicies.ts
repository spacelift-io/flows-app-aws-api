import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListCachePoliciesCommand,
} from "@aws-sdk/client-cloudfront";

const listCachePolicies: AppBlock = {
  name: "List Cache Policies",
  description: "Gets a list of cache policies.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Type: {
          name: "Type",
          description:
            "A filter to return only the specified kinds of cache policies.",
          type: "string",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this field when paginating results to indicate where to begin in your list of cache policies.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of cache policies that you want in the response.",
          type: "number",
          required: false,
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

        const command = new ListCachePoliciesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Cache Policies Result",
      description: "Result from ListCachePolicies operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CachePolicyList: {
            type: "object",
            properties: {
              NextMarker: {
                type: "string",
              },
              MaxItems: {
                type: "number",
              },
              Quantity: {
                type: "number",
              },
              Items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Type: {
                      type: "string",
                    },
                    CachePolicy: {
                      type: "object",
                      properties: {
                        Id: {
                          type: "object",
                          additionalProperties: true,
                        },
                        LastModifiedTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                        CachePolicyConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Id", "LastModifiedTime", "CachePolicyConfig"],
                      additionalProperties: false,
                    },
                  },
                  required: ["Type", "CachePolicy"],
                  additionalProperties: false,
                },
              },
            },
            required: ["MaxItems", "Quantity"],
            additionalProperties: false,
            description: "A list of cache policies.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listCachePolicies;
