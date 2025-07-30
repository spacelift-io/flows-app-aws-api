import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, UpdateWebACLCommand } from "@aws-sdk/client-waf";

const updateWebACL: AppBlock = {
  name: "Update Web ACL",
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
        WebACLId: {
          name: "Web ACL Id",
          description: "The WebACLId of the WebACL that you want to update.",
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
          description: "An array of updates to make to the WebACL.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Action: {
                  type: "string",
                },
                ActivatedRule: {
                  type: "object",
                  properties: {
                    Priority: {
                      type: "number",
                    },
                    RuleId: {
                      type: "string",
                    },
                    Action: {
                      type: "object",
                      properties: {
                        Type: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Type"],
                      additionalProperties: false,
                    },
                    OverrideAction: {
                      type: "object",
                      properties: {
                        Type: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Type"],
                      additionalProperties: false,
                    },
                    Type: {
                      type: "string",
                    },
                    ExcludedRules: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  required: ["Priority", "RuleId"],
                  additionalProperties: false,
                },
              },
              required: ["Action", "ActivatedRule"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        DefaultAction: {
          name: "Default Action",
          description:
            "A default action for the web ACL, either ALLOW or BLOCK.",
          type: {
            type: "object",
            properties: {
              Type: {
                type: "string",
              },
            },
            required: ["Type"],
            additionalProperties: false,
          },
          required: false,
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

        const command = new UpdateWebACLCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Web ACL Result",
      description: "Result from UpdateWebACL operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the UpdateWebACL request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateWebACL;
