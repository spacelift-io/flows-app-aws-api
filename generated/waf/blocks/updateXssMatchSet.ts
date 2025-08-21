import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, UpdateXssMatchSetCommand } from "@aws-sdk/client-waf";

const updateXssMatchSet: AppBlock = {
  name: "Update Xss Match Set",
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
            "The XssMatchSetId of the XssMatchSet that you want to update.",
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
            "An array of XssMatchSetUpdate objects that you want to insert into or delete from an XssMatchSet.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Action: {
                  type: "string",
                },
                XssMatchTuple: {
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
              required: ["Action", "XssMatchTuple"],
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new UpdateXssMatchSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Xss Match Set Result",
      description: "Result from UpdateXssMatchSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the UpdateXssMatchSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateXssMatchSet;
