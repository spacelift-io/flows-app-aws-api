import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteQueuedReservedInstancesCommand,
} from "@aws-sdk/client-ec2";

const deleteQueuedReservedInstances: AppBlock = {
  name: "Delete Queued Reserved Instances",
  description:
    "Deletes the queued purchases for the specified Reserved Instances.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        ReservedInstancesIds: {
          name: "Reserved Instances Ids",
          description: "The IDs of the Reserved Instances.",
          type: {
            type: "array",
            items: {
              type: "string",
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

        const command = new DeleteQueuedReservedInstancesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Queued Reserved Instances Result",
      description: "Result from DeleteQueuedReservedInstances operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SuccessfulQueuedPurchaseDeletions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ReservedInstancesId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the queued purchases that were successfully deleted.",
          },
          FailedQueuedPurchaseDeletions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Error: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "string",
                    },
                    Message: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                ReservedInstancesId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the queued purchases that could not be deleted.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteQueuedReservedInstances;
