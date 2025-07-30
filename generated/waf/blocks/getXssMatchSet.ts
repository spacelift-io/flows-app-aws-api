import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetXssMatchSetCommand } from "@aws-sdk/client-waf";

const getXssMatchSet: AppBlock = {
  name: "Get Xss Match Set",
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
        XssMatchSetId: {
          name: "Xss Match Set Id",
          description:
            "The XssMatchSetId of the XssMatchSet that you want to get.",
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

        const command = new GetXssMatchSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Xss Match Set Result",
      description: "Result from GetXssMatchSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          XssMatchSet: {
            type: "object",
            properties: {
              XssMatchSetId: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              XssMatchTuples: {
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
                  },
                  required: ["FieldToMatch", "TextTransformation"],
                  additionalProperties: false,
                },
              },
            },
            required: ["XssMatchSetId", "XssMatchTuples"],
            additionalProperties: false,
            description:
              "Information about the XssMatchSet that you specified in the GetXssMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getXssMatchSet;
