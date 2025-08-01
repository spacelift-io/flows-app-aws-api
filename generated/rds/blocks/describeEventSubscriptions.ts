import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeEventSubscriptionsCommand,
} from "@aws-sdk/client-rds";

const describeEventSubscriptions: AppBlock = {
  name: "Describe Event Subscriptions",
  description:
    "Lists all the subscription descriptions for a customer account.",
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
            "The name of the RDS event notification subscription you want to describe.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "This parameter isn't currently supported.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["Name", "Values"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous DescribeOrderableDBInstanceOptions request.",
          type: "string",
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
        });

        const command = new DescribeEventSubscriptionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Event Subscriptions Result",
      description: "Result from DescribeEventSubscriptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous DescribeOrderableDBInstanceOptions request.",
          },
          EventSubscriptionsList: {
            type: "array",
            items: {
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
            },
            description: "A list of EventSubscriptions data types.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeEventSubscriptions;
