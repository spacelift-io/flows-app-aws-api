import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeCapacityReservationBillingRequestsCommand,
} from "@aws-sdk/client-ec2";

const describeCapacityReservationBillingRequests: AppBlock = {
  name: "Describe Capacity Reservation Billing Requests",
  description:
    "Describes a request to assign the billing of the unused capacity of a Capacity Reservation.",
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
          description: "The ID of the Capacity Reservation.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Role: {
          name: "Role",
          description:
            "Specify one of the following: odcr-owner - If you are the Capacity Reservation owner, specify this value to view requests that you have initiated.",
          type: "string",
          required: true,
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
          description: "One or more filters.",
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

        const command = new DescribeCapacityReservationBillingRequestsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Capacity Reservation Billing Requests Result",
      description:
        "Result from DescribeCapacityReservationBillingRequests operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
          CapacityReservationBillingRequests: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CapacityReservationId: {
                  type: "string",
                },
                RequestedBy: {
                  type: "string",
                },
                UnusedReservationBillingOwnerId: {
                  type: "string",
                },
                LastUpdateTime: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusMessage: {
                  type: "string",
                },
                CapacityReservationInfo: {
                  type: "object",
                  properties: {
                    InstanceType: {
                      type: "string",
                    },
                    AvailabilityZone: {
                      type: "string",
                    },
                    Tenancy: {
                      type: "string",
                    },
                    AvailabilityZoneId: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "Information about the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeCapacityReservationBillingRequests;
