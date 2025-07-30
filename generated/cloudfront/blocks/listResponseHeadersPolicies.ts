import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListResponseHeadersPoliciesCommand,
} from "@aws-sdk/client-cloudfront";

const listResponseHeadersPolicies: AppBlock = {
  name: "List Response Headers Policies",
  description: "Gets a list of response headers policies.",
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
            "A filter to get only the specified kind of response headers policies.",
          type: "string",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this field when paginating results to indicate where to begin in your list of response headers policies.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of response headers policies that you want to get in the response.",
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

        const command = new ListResponseHeadersPoliciesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Response Headers Policies Result",
      description: "Result from ListResponseHeadersPolicies operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ResponseHeadersPolicyList: {
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
                    ResponseHeadersPolicy: {
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
                        ResponseHeadersPolicyConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: [
                        "Id",
                        "LastModifiedTime",
                        "ResponseHeadersPolicyConfig",
                      ],
                      additionalProperties: false,
                    },
                  },
                  required: ["Type", "ResponseHeadersPolicy"],
                  additionalProperties: false,
                },
              },
            },
            required: ["MaxItems", "Quantity"],
            additionalProperties: false,
            description: "A list of response headers policies.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listResponseHeadersPolicies;
