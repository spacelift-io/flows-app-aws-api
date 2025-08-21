import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetByteMatchSetCommand } from "@aws-sdk/client-waf";

const getByteMatchSet: AppBlock = {
  name: "Get Byte Match Set",
  description: "This is AWS WAF Classic documentation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ByteMatchSetId: {
          name: "Byte Match Set Id",
          description:
            "The ByteMatchSetId of the ByteMatchSet that you want to get.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new WAFClient({
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

        const command = new GetByteMatchSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Byte Match Set Result",
      description: "Result from GetByteMatchSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ByteMatchSet: {
            type: "object",
            properties: {
              ByteMatchSetId: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              ByteMatchTuples: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    FieldToMatch: {
                      type: "object",
                      properties: {
                        Type: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Data: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Type"],
                      additionalProperties: false,
                    },
                    TargetString: {
                      type: "string",
                    },
                    TextTransformation: {
                      type: "string",
                    },
                    PositionalConstraint: {
                      type: "string",
                    },
                  },
                  required: [
                    "FieldToMatch",
                    "TargetString",
                    "TextTransformation",
                    "PositionalConstraint",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["ByteMatchSetId", "ByteMatchTuples"],
            additionalProperties: false,
            description:
              "Information about the ByteMatchSet that you specified in the GetByteMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getByteMatchSet;
