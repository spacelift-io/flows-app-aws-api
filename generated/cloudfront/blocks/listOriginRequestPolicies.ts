import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListOriginRequestPoliciesCommand,
} from "@aws-sdk/client-cloudfront";

const listOriginRequestPolicies: AppBlock = {
  name: "List Origin Request Policies",
  description: "Gets a list of origin request policies.",
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
            "A filter to return only the specified kinds of origin request policies.",
          type: "string",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this field when paginating results to indicate where to begin in your list of origin request policies.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of origin request policies that you want in the response.",
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
        });

        const command = new ListOriginRequestPoliciesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Origin Request Policies Result",
      description: "Result from ListOriginRequestPolicies operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OriginRequestPolicyList: {
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
                    OriginRequestPolicy: {
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
                        OriginRequestPolicyConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: [
                        "Id",
                        "LastModifiedTime",
                        "OriginRequestPolicyConfig",
                      ],
                      additionalProperties: false,
                    },
                  },
                  required: ["Type", "OriginRequestPolicy"],
                  additionalProperties: false,
                },
              },
            },
            required: ["MaxItems", "Quantity"],
            additionalProperties: false,
            description: "A list of origin request policies.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listOriginRequestPolicies;
