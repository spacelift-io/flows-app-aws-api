import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  DescribeActiveReceiptRuleSetCommand,
} from "@aws-sdk/client-ses";

const describeActiveReceiptRuleSet: AppBlock = {
  name: "Describe Active Receipt Rule Set",
  description:
    "Returns the metadata and receipt rules for the receipt rule set that is currently active.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
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
        });

        const command = new DescribeActiveReceiptRuleSetCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Active Receipt Rule Set Result",
      description: "Result from DescribeActiveReceiptRuleSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Metadata: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
              CreatedTimestamp: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The metadata for the currently active receipt rule set.",
          },
          Rules: {
            type: "array",
            items: {
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
                        additionalProperties: true,
                      },
                      BounceAction: {
                        type: "object",
                        additionalProperties: true,
                      },
                      WorkmailAction: {
                        type: "object",
                        additionalProperties: true,
                      },
                      LambdaAction: {
                        type: "object",
                        additionalProperties: true,
                      },
                      StopAction: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AddHeaderAction: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SNSAction: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ConnectAction: {
                        type: "object",
                        additionalProperties: true,
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
            description:
              "The receipt rules that belong to the active rule set.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeActiveReceiptRuleSet;
