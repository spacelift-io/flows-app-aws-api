import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeEventSubscriptionsCommand,
} from "@aws-sdk/client-redshift";

const describeEventSubscriptions: AppBlock = {
  name: "Describe Event Subscriptions",
  description: `Lists descriptions of all the Amazon Redshift event notification subscriptions for a customer account.`,
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
            "The name of the Amazon Redshift event notification subscription to be described.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of response records to return in each call.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional parameter that specifies the starting point to return a set of response records.",
          type: "string",
          required: false,
        },
        TagKeys: {
          name: "Tag Keys",
          description:
            "A tag key or keys for which you want to return all matching event notification subscriptions that are associated with the specified key or keys.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        TagValues: {
          name: "Tag Values",
          description:
            "A tag value or values for which you want to return all matching event notification subscriptions that are associated with the specified tag value or values.",
          type: {
            type: "array",
            items: {
              type: "string",
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
              "A value that indicates the starting point for the next set of response records in a subsequent request.",
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
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description: "A list of event subscriptions.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeEventSubscriptions;
