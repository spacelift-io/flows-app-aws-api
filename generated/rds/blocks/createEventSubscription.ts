import { AppBlock, events } from "@slflows/sdk/v1";
import { RDSClient, CreateEventSubscriptionCommand } from "@aws-sdk/client-rds";

const createEventSubscription: AppBlock = {
  name: "Create Event Subscription",
  description: "Creates an RDS event notification subscription.",
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
          description: "The name of the subscription.",
          type: "string",
          required: true,
        },
        SnsTopicArn: {
          name: "Sns Topic Arn",
          description:
            "The Amazon Resource Name (ARN) of the SNS topic created for event notification.",
          type: "string",
          required: true,
        },
        SourceType: {
          name: "Source Type",
          description: "The type of source that is generating the events.",
          type: "string",
          required: false,
        },
        EventCategories: {
          name: "Event Categories",
          description:
            "A list of event categories for a particular source type (SourceType) that you want to subscribe to.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        SourceIds: {
          name: "Source Ids",
          description:
            "The list of identifiers of the event sources for which events are returned.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Enabled: {
          name: "Enabled",
          description: "Specifies whether to activate the subscription.",
          type: "boolean",
          required: false,
        },
        Tags: {
          name: "Tags",
          description: "A list of tags.",
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

        const client = new RDSClient({
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
              Enabled: {
                type: "boolean",
              },
              EventSubscriptionArn: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Contains the results of a successful invocation of the DescribeEventSubscriptions action.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createEventSubscription;
