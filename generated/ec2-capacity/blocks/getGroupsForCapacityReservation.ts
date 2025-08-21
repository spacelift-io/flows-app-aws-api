import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetGroupsForCapacityReservationCommand,
} from "@aws-sdk/client-ec2";

const getGroupsForCapacityReservation: AppBlock = {
  name: "Get Groups For Capacity Reservation",
  description:
    "Lists the resource groups to which a Capacity Reservation has been added.",
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

        const command = new GetGroupsForCapacityReservationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Groups For Capacity Reservation Result",
      description: "Result from GetGroupsForCapacityReservation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
          CapacityReservationGroups: {
            type: "array",
            items: {
              type: "object",
              properties: {
                GroupArn: {
                  type: "string",
                },
                OwnerId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the resource groups to which the Capacity Reservation has been added.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getGroupsForCapacityReservation;
