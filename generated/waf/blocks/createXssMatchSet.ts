import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, CreateXssMatchSetCommand } from "@aws-sdk/client-waf";

const createXssMatchSet: AppBlock = {
  name: "Create Xss Match Set",
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
            "A friendly name or description for the XssMatchSet that you're creating.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateXssMatchSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Xss Match Set Result",
      description: "Result from CreateXssMatchSet operation",
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
            description: "An XssMatchSet.",
          },
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the CreateXssMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createXssMatchSet;
