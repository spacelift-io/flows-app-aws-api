import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeCapacityBlockExtensionHistoryCommand,
} from "@aws-sdk/client-ec2";

const describeCapacityBlockExtensionHistory: AppBlock = {
  name: "Describe Capacity Block Extension History",
  description:
    "Describes the events for the specified Capacity Block extension during the specified time.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CapacityReservationIds: {
          name: "Capacity Reservation Ids",
          description:
            "The IDs of Capacity Block reservations that you want to display the history for.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to use to retrieve the next page of results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
          type: "number",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "One or more filters availability-zone - The Availability Zone of the extension.",
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
              additionalProperties: false,
            },
          },
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new DescribeCapacityBlockExtensionHistoryCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Capacity Block Extension History Result",
      description:
        "Result from DescribeCapacityBlockExtensionHistory operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CapacityBlockExtensions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CapacityReservationId: {
                  type: "string",
                },
                InstanceType: {
                  type: "string",
                },
                InstanceCount: {
                  type: "number",
                },
                AvailabilityZone: {
                  type: "string",
                },
                AvailabilityZoneId: {
                  type: "string",
                },
                CapacityBlockExtensionOfferingId: {
                  type: "string",
                },
                CapacityBlockExtensionDurationHours: {
                  type: "number",
                },
                CapacityBlockExtensionStatus: {
                  type: "string",
                },
                CapacityBlockExtensionPurchaseDate: {
                  type: "string",
                },
                CapacityBlockExtensionStartDate: {
                  type: "string",
                },
                CapacityBlockExtensionEndDate: {
                  type: "string",
                },
                UpfrontFee: {
                  type: "string",
                },
                CurrencyCode: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Describes one or more of your Capacity Block extensions.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeCapacityBlockExtensionHistory;
