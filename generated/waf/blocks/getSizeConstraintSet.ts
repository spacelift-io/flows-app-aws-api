import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetSizeConstraintSetCommand } from "@aws-sdk/client-waf";

const getSizeConstraintSet: AppBlock = {
  name: "Get Size Constraint Set",
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
            "The SizeConstraintSetId of the SizeConstraintSet that you want to get.",
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

        const command = new GetSizeConstraintSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Size Constraint Set Result",
      description: "Result from GetSizeConstraintSet operation",
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
              "Information about the SizeConstraintSet that you specified in the GetSizeConstraintSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getSizeConstraintSet;
