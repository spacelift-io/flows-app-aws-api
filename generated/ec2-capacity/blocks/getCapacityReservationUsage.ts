import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetCapacityReservationUsageCommand,
} from "@aws-sdk/client-ec2";

const getCapacityReservationUsage: AppBlock = {
  name: "Get Capacity Reservation Usage",
  description: "Gets usage information about a Capacity Reservation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CapacityReservationId: {
          name: "Capacity Reservation Id",
          description: "The ID of the Capacity Reservation.",
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

        const command = new GetCapacityReservationUsageCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Capacity Reservation Usage Result",
      description: "Result from GetCapacityReservationUsage operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
          CapacityReservationId: {
            type: "string",
            description: "The ID of the Capacity Reservation.",
          },
          InstanceType: {
            type: "string",
            description:
              "The type of instance for which the Capacity Reservation reserves capacity.",
          },
          TotalInstanceCount: {
            type: "number",
            description:
              "The number of instances for which the Capacity Reservation reserves capacity.",
          },
          AvailableInstanceCount: {
            type: "number",
            description: "The remaining capacity.",
          },
          State: {
            type: "string",
            description: "The current state of the Capacity Reservation.",
          },
          InstanceUsages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AccountId: {
                  type: "string",
                },
                UsedInstanceCount: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the Capacity Reservation usage.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getCapacityReservationUsage;
