import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeCapacityReservationsCommand,
} from "@aws-sdk/client-ec2";

const describeCapacityReservations: AppBlock = {
  name: "Describe Capacity Reservations",
  description: "Describes one or more of your Capacity Reservations.",
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
        });

        const command = new DescribeCapacityReservationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Capacity Reservations Result",
      description: "Result from DescribeCapacityReservations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
          CapacityReservations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CapacityReservationId: {
                  type: "string",
                },
                OwnerId: {
                  type: "string",
                },
                CapacityReservationArn: {
                  type: "string",
                },
                AvailabilityZoneId: {
                  type: "string",
                },
                InstanceType: {
                  type: "string",
                },
                InstancePlatform: {
                  type: "string",
                },
                AvailabilityZone: {
                  type: "string",
                },
                Tenancy: {
                  type: "string",
                },
                TotalInstanceCount: {
                  type: "number",
                },
                AvailableInstanceCount: {
                  type: "number",
                },
                EbsOptimized: {
                  type: "boolean",
                },
                EphemeralStorage: {
                  type: "boolean",
                },
                State: {
                  type: "string",
                },
                StartDate: {
                  type: "string",
                },
                EndDate: {
                  type: "string",
                },
                EndDateType: {
                  type: "string",
                },
                InstanceMatchCriteria: {
                  type: "string",
                },
                CreateDate: {
                  type: "string",
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
                OutpostArn: {
                  type: "string",
                },
                CapacityReservationFleetId: {
                  type: "string",
                },
                PlacementGroupArn: {
                  type: "string",
                },
                CapacityAllocations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      AllocationType: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Count: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                ReservationType: {
                  type: "string",
                },
                UnusedReservationBillingOwnerId: {
                  type: "string",
                },
                CommitmentInfo: {
                  type: "object",
                  properties: {
                    CommittedInstanceCount: {
                      type: "number",
                    },
                    CommitmentEndDate: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                DeliveryPreference: {
                  type: "string",
                },
                CapacityBlockId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the Capacity Reservations.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeCapacityReservations;
