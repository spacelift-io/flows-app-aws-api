import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  PurchaseScheduledInstancesCommand,
} from "@aws-sdk/client-ec2";

const purchaseScheduledInstances: AppBlock = {
  name: "Purchase Scheduled Instances",
  description: "You can no longer purchase Scheduled Instances.",
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
            "Unique, case-sensitive identifier that ensures the idempotency of the request.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        PurchaseRequests: {
          name: "Purchase Requests",
          description: "The purchase requests.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InstanceCount: {
                  type: "number",
                },
                PurchaseToken: {
                  type: "string",
                },
              },
              required: ["InstanceCount", "PurchaseToken"],
              additionalProperties: false,
            },
          },
          required: true,
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

        const command = new PurchaseScheduledInstancesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Purchase Scheduled Instances Result",
      description: "Result from PurchaseScheduledInstances operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ScheduledInstanceSet: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AvailabilityZone: {
                  type: "string",
                },
                CreateDate: {
                  type: "string",
                },
                HourlyPrice: {
                  type: "string",
                },
                InstanceCount: {
                  type: "number",
                },
                InstanceType: {
                  type: "string",
                },
                NetworkPlatform: {
                  type: "string",
                },
                NextSlotStartTime: {
                  type: "string",
                },
                Platform: {
                  type: "string",
                },
                PreviousSlotEndTime: {
                  type: "string",
                },
                Recurrence: {
                  type: "object",
                  properties: {
                    Frequency: {
                      type: "string",
                    },
                    Interval: {
                      type: "number",
                    },
                    OccurrenceDaySet: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    OccurrenceRelativeToEnd: {
                      type: "boolean",
                    },
                    OccurrenceUnit: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                ScheduledInstanceId: {
                  type: "string",
                },
                SlotDurationInHours: {
                  type: "number",
                },
                TermEndDate: {
                  type: "string",
                },
                TermStartDate: {
                  type: "string",
                },
                TotalScheduledInstanceHours: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the Scheduled Instances.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default purchaseScheduledInstances;
