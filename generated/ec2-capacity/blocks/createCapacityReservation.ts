import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateCapacityReservationCommand,
} from "@aws-sdk/client-ec2";

const createCapacityReservation: AppBlock = {
  name: "Create Capacity Reservation",
  description:
    "Creates a new Capacity Reservation with the specified attributes.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        InstanceType: {
          name: "Instance Type",
          description: "The instance type for which to reserve capacity.",
          type: "string",
          required: true,
        },
        InstancePlatform: {
          name: "Instance Platform",
          description:
            "The type of operating system for which to reserve capacity.",
          type: "string",
          required: true,
        },
        AvailabilityZone: {
          name: "Availability Zone",
          description:
            "The Availability Zone in which to create the Capacity Reservation.",
          type: "string",
          required: false,
        },
        AvailabilityZoneId: {
          name: "Availability Zone Id",
          description:
            "The ID of the Availability Zone in which to create the Capacity Reservation.",
          type: "string",
          required: false,
        },
        Tenancy: {
          name: "Tenancy",
          description: "Indicates the tenancy of the Capacity Reservation.",
          type: "string",
          required: false,
        },
        InstanceCount: {
          name: "Instance Count",
          description: "The number of instances for which to reserve capacity.",
          type: "number",
          required: true,
        },
        EbsOptimized: {
          name: "Ebs Optimized",
          description:
            "Indicates whether the Capacity Reservation supports EBS-optimized instances.",
          type: "boolean",
          required: false,
        },
        EphemeralStorage: {
          name: "Ephemeral Storage",
          description: "Deprecated.",
          type: "boolean",
          required: false,
        },
        EndDate: {
          name: "End Date",
          description:
            "The date and time at which the Capacity Reservation expires.",
          type: "string",
          required: false,
        },
        EndDateType: {
          name: "End Date Type",
          description:
            "Indicates the way in which the Capacity Reservation ends.",
          type: "string",
          required: false,
        },
        InstanceMatchCriteria: {
          name: "Instance Match Criteria",
          description:
            "Indicates the type of instance launches that the Capacity Reservation accepts.",
          type: "string",
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description:
            "The tags to apply to the Capacity Reservation during launch.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
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
        OutpostArn: {
          name: "Outpost Arn",
          description: "Not supported for future-dated Capacity Reservations.",
          type: "string",
          required: false,
        },
        PlacementGroupArn: {
          name: "Placement Group Arn",
          description: "Not supported for future-dated Capacity Reservations.",
          type: "string",
          required: false,
        },
        StartDate: {
          name: "Start Date",
          description: "Required for future-dated Capacity Reservations only.",
          type: "string",
          required: false,
        },
        CommitmentDuration: {
          name: "Commitment Duration",
          description: "Required for future-dated Capacity Reservations only.",
          type: "number",
          required: false,
        },
        DeliveryPreference: {
          name: "Delivery Preference",
          description: "Required for future-dated Capacity Reservations only.",
          type: "string",
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

        const command = new CreateCapacityReservationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Capacity Reservation Result",
      description: "Result from CreateCapacityReservation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CapacityReservation: {
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
                      type: "string",
                    },
                    Value: {
                      type: "string",
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
                      type: "string",
                    },
                    Count: {
                      type: "number",
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
            description: "Information about the Capacity Reservation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createCapacityReservation;
