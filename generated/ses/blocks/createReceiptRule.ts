import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, CreateReceiptRuleCommand } from "@aws-sdk/client-ses";

const createReceiptRule: AppBlock = {
  name: "Create Receipt Rule",
  description: "Creates a receipt rule.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RuleSetName: {
          name: "Rule Set Name",
          description:
            "The name of the rule set where the receipt rule is added.",
          type: "string",
          required: true,
        },
        After: {
          name: "After",
          description:
            "The name of an existing rule after which the new rule is placed.",
          type: "string",
          required: false,
        },
        Rule: {
          name: "Rule",
          description:
            "A data structure that contains the specified rule's name, actions, recipients, domains, enabled status, scan status, and TLS policy.",
          type: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
              Enabled: {
                type: "boolean",
              },
              TlsPolicy: {
                type: "string",
              },
              Recipients: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              Actions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    S3Action: {
                      type: "object",
                      properties: {
                        TopicArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        BucketName: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ObjectKeyPrefix: {
                          type: "object",
                          additionalProperties: true,
                        },
                        KmsKeyArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        IamRoleArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["BucketName"],
                      additionalProperties: false,
                    },
                    BounceAction: {
                      type: "object",
                      properties: {
                        TopicArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        SmtpReplyCode: {
                          type: "object",
                          additionalProperties: true,
                        },
                        StatusCode: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Message: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Sender: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["SmtpReplyCode", "Message", "Sender"],
                      additionalProperties: false,
                    },
                    WorkmailAction: {
                      type: "object",
                      properties: {
                        TopicArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        OrganizationArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["OrganizationArn"],
                      additionalProperties: false,
                    },
                    LambdaAction: {
                      type: "object",
                      properties: {
                        TopicArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        FunctionArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        InvocationType: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["FunctionArn"],
                      additionalProperties: false,
                    },
                    StopAction: {
                      type: "object",
                      properties: {
                        Scope: {
                          type: "object",
                          additionalProperties: true,
                        },
                        TopicArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Scope"],
                      additionalProperties: false,
                    },
                    AddHeaderAction: {
                      type: "object",
                      properties: {
                        HeaderName: {
                          type: "object",
                          additionalProperties: true,
                        },
                        HeaderValue: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["HeaderName", "HeaderValue"],
                      additionalProperties: false,
                    },
                    SNSAction: {
                      type: "object",
                      properties: {
                        TopicArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Encoding: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["TopicArn"],
                      additionalProperties: false,
                    },
                    ConnectAction: {
                      type: "object",
                      properties: {
                        InstanceARN: {
                          type: "object",
                          additionalProperties: true,
                        },
                        IAMRoleARN: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["InstanceARN", "IAMRoleARN"],
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
              },
              ScanEnabled: {
                type: "boolean",
              },
            },
            required: ["Name"],
            additionalProperties: false,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SESClient({
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

        const command = new CreateReceiptRuleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Receipt Rule Result",
      description: "Result from CreateReceiptRule operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default createReceiptRule;
