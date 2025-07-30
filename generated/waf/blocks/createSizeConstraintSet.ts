import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, CreateSizeConstraintSetCommand } from "@aws-sdk/client-waf";

const createSizeConstraintSet: AppBlock = {
  name: "Create Size Constraint Set",
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
          description:
            "A friendly name or description of the SizeConstraintSet.",
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

        const command = new CreateSizeConstraintSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Size Constraint Set Result",
      description: "Result from CreateSizeConstraintSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SizeConstraintSet: {
            type: "object",
            properties: {
              SizeConstraintSetId: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              SizeConstraints: {
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
            },
            required: ["SizeConstraintSetId", "SizeConstraints"],
            additionalProperties: false,
            description:
              "A SizeConstraintSet that contains no SizeConstraint objects.",
          },
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the CreateSizeConstraintSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createSizeConstraintSet;
