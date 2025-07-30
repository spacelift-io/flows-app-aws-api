import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListFunctionsCommand,
} from "@aws-sdk/client-cloudfront";

const listFunctions: AppBlock = {
  name: "List Functions",
  description:
    "Gets a list of all CloudFront functions in your Amazon Web Services account.",
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
            "Use this field when paginating results to indicate where to begin in your list of functions.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of functions that you want in the response.",
          type: "number",
          required: false,
        },
        Stage: {
          name: "Stage",
          description:
            "An optional filter to return only the functions that are in the specified stage, either DEVELOPMENT or LIVE.",
          type: "string",
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

        const command = new ListFunctionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Functions Result",
      description: "Result from ListFunctions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FunctionList: {
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
                    Name: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                    FunctionConfig: {
                      type: "object",
                      properties: {
                        Comment: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Runtime: {
                          type: "object",
                          additionalProperties: true,
                        },
                        KeyValueStoreAssociations: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Comment", "Runtime"],
                      additionalProperties: false,
                    },
                    FunctionMetadata: {
                      type: "object",
                      properties: {
                        FunctionARN: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Stage: {
                          type: "object",
                          additionalProperties: true,
                        },
                        CreatedTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                        LastModifiedTime: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["FunctionARN", "LastModifiedTime"],
                      additionalProperties: false,
                    },
                  },
                  required: ["Name", "FunctionConfig", "FunctionMetadata"],
                  additionalProperties: false,
                },
              },
            },
            required: ["MaxItems", "Quantity"],
            additionalProperties: false,
            description: "A list of CloudFront functions.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listFunctions;
