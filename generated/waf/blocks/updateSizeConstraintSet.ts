import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, UpdateSizeConstraintSetCommand } from "@aws-sdk/client-waf";

const updateSizeConstraintSet: AppBlock = {
  name: "Update Size Constraint Set",
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
        SizeConstraintSetId: {
          name: "Size Constraint Set Id",
          description:
            "The SizeConstraintSetId of the SizeConstraintSet that you want to update.",
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
            "An array of SizeConstraintSetUpdate objects that you want to insert into or delete from a SizeConstraintSet.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Action: {
                  type: "string",
                },
                SizeConstraint: {
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
                    TextTransformation: {
                      type: "string",
                    },
                    ComparisonOperator: {
                      type: "string",
                    },
                    Size: {
                      type: "number",
                    },
                  },
                  required: [
                    "FieldToMatch",
                    "TextTransformation",
                    "ComparisonOperator",
                    "Size",
                  ],
                  additionalProperties: false,
                },
              },
              required: ["Action", "SizeConstraint"],
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

        const command = new UpdateSizeConstraintSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Size Constraint Set Result",
      description: "Result from UpdateSizeConstraintSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the UpdateSizeConstraintSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateSizeConstraintSet;
