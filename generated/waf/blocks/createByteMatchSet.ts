import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, CreateByteMatchSetCommand } from "@aws-sdk/client-waf";

const createByteMatchSet: AppBlock = {
  name: "Create Byte Match Set",
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
        Name: {
          name: "Name",
          description: "A friendly name or description of the ByteMatchSet.",
          type: "string",
          required: true,
        },
        ChangeToken: {
          name: "Change Token",
          description:
            "The value returned by the most recent call to GetChangeToken.",
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
        });

        const command = new CreateByteMatchSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Byte Match Set Result",
      description: "Result from CreateByteMatchSet operation",
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
              "A ByteMatchSet that contains no ByteMatchTuple objects.",
          },
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the CreateByteMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createByteMatchSet;
