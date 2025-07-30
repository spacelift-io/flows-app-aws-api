import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, CreateWebACLCommand } from "@aws-sdk/client-waf";

const createWebACL: AppBlock = {
  name: "Create Web ACL",
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
          description: "A friendly name or description of the WebACL.",
          type: "string",
          required: true,
        },
        MetricName: {
          name: "Metric Name",
          description:
            "A friendly name or description for the metrics for this WebACL.",
          type: "string",
          required: true,
        },
        DefaultAction: {
          name: "Default Action",
          description:
            "The action that you want AWS WAF to take when a request doesn't match the criteria specified in any of the Rule objects that are associated with the WebACL.",
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
          required: true,
        },
        ChangeToken: {
          name: "Change Token",
          description:
            "The value returned by the most recent call to GetChangeToken.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key", "Value"],
              additionalProperties: false,
            },
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

        const command = new CreateWebACLCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Web ACL Result",
      description: "Result from CreateWebACL operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WebACL: {
            type: "object",
            properties: {
              WebACLId: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              MetricName: {
                type: "string",
              },
              DefaultAction: {
                type: "object",
                properties: {
                  Type: {
                    type: "string",
                  },
                },
                required: ["Type"],
                additionalProperties: false,
              },
              Rules: {
                type: "array",
                items: {
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
              WebACLArn: {
                type: "string",
              },
            },
            required: ["WebACLId", "DefaultAction", "Rules"],
            additionalProperties: false,
            description: "The WebACL returned in the CreateWebACL response.",
          },
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the CreateWebACL request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createWebACL;
