import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  CreateEventSubscriptionCommand,
} from "@aws-sdk/client-redshift";

const createEventSubscription: AppBlock = {
  name: "Create Event Subscription",
  description: `Creates an Amazon Redshift event notification subscription.`,
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
          description: "The name of the event subscription to be created.",
          type: "string",
          required: true,
        },
        SnsTopicArn: {
          name: "Sns Topic Arn",
          description:
            "The Amazon Resource Name (ARN) of the Amazon SNS topic used to transmit the event notifications.",
          type: "string",
          required: true,
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
            "A boolean value; set to true to activate the subscription, and set to false to create the subscription but not activate it.",
          type: "boolean",
          required: false,
        },
        Tags: {
          name: "Tags",
          description: "A list of tag instances.",
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
              additionalProperties: false,
            },
          },
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

        const command = new CreateEventSubscriptionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Event Subscription Result",
      description: "Result from CreateEventSubscription operation",
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

export default createEventSubscription;
