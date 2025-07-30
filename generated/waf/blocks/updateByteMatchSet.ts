import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, UpdateByteMatchSetCommand } from "@aws-sdk/client-waf";

const updateByteMatchSet: AppBlock = {
  name: "Update Byte Match Set",
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
            "The ByteMatchSetId of the ByteMatchSet that you want to update.",
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
        Updates: {
          name: "Updates",
          description:
            "An array of ByteMatchSetUpdate objects that you want to insert into or delete from a ByteMatchSet.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Action: {
                  type: "string",
                },
                ByteMatchTuple: {
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
              required: ["Action", "ByteMatchTuple"],
              additionalProperties: false,
            },
          },
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

        const command = new UpdateByteMatchSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Byte Match Set Result",
      description: "Result from UpdateByteMatchSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the UpdateByteMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateByteMatchSet;
