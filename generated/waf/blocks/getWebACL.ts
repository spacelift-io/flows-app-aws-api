import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, GetWebACLCommand } from "@aws-sdk/client-waf";

const getWebACL: AppBlock = {
  name: "Get Web ACL",
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
          description: "The WebACLId of the WebACL that you want to get.",
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

        const command = new GetWebACLCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Web ACL Result",
      description: "Result from GetWebACL operation",
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
            description:
              "Information about the WebACL that you specified in the GetWebACL request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getWebACL;
