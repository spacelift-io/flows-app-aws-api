import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteSubnetCidrReservationCommand,
} from "@aws-sdk/client-ec2";

const deleteSubnetCidrReservation: AppBlock = {
  name: "Delete Subnet Cidr Reservation",
  description: "Deletes a subnet CIDR reservation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SubnetCidrReservationId: {
          name: "Subnet Cidr Reservation Id",
          description: "The ID of the subnet CIDR reservation.",
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

        const command = new DeleteSubnetCidrReservationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Subnet Cidr Reservation Result",
      description: "Result from DeleteSubnetCidrReservation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DeletedSubnetCidrReservation: {
            type: "object",
            properties: {
              SubnetCidrReservationId: {
                type: "string",
              },
              SubnetId: {
                type: "string",
              },
              Cidr: {
                type: "string",
              },
              ReservationType: {
                type: "string",
              },
              OwnerId: {
                type: "string",
              },
              Description: {
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
            },
            additionalProperties: false,
            description:
              "Information about the deleted subnet CIDR reservation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteSubnetCidrReservation;
