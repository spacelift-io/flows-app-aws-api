import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  ModifyEventSubscriptionCommand,
} from "@aws-sdk/client-redshift";

const modifyEventSubscription: AppBlock = {
  name: "Modify Event Subscription",
  description: `Modifies an existing Amazon Redshift event notification subscription.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SubscriptionName: {
          name: "Subscription Name",
          description:
            "The name of the modified Amazon Redshift event notification subscription.",
          type: "string",
          required: true,
        },
        SnsTopicArn: {
          name: "Sns Topic Arn",
          description:
            "The Amazon Resource Name (ARN) of the SNS topic to be used by the event notification subscription.",
          type: "string",
          required: false,
        },
        SourceType: {
          name: "Source Type",
          description: "The type of source that will be generating the events.",
          type: "string",
          required: false,
        },
        SourceIds: {
          name: "Source Ids",
          description:
            "A list of one or more identifiers of Amazon Redshift source objects.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        EventCategories: {
          name: "Event Categories",
          description:
            "Specifies the Amazon Redshift event categories to be published by the event notification subscription.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Severity: {
          name: "Severity",
          description:
            "Specifies the Amazon Redshift event severity to be published by the event notification subscription.",
          type: "string",
          required: false,
        },
        Enabled: {
          name: "Enabled",
          description:
            "A Boolean value indicating if the subscription is enabled.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new ModifyEventSubscriptionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Event Subscription Result",
      description: "Result from ModifyEventSubscription operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EventSubscription: {
            type: "object",
            properties: {
              CustomerAwsId: {
                type: "string",
              },
              CustSubscriptionId: {
                type: "string",
              },
              SnsTopicArn: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              SubscriptionCreationTime: {
                type: "string",
              },
              SourceType: {
                type: "string",
              },
              SourceIdsList: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              EventCategoriesList: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              Severity: {
                type: "string",
              },
              Enabled: {
                type: "boolean",
              },
              Tags: {
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
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "Describes event subscriptions.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyEventSubscription;
