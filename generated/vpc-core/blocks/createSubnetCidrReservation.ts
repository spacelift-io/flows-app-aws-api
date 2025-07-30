import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateSubnetCidrReservationCommand,
} from "@aws-sdk/client-ec2";

const createSubnetCidrReservation: AppBlock = {
  name: "Create Subnet Cidr Reservation",
  description: "Creates a subnet CIDR reservation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SubnetId: {
          name: "Subnet Id",
          description: "The ID of the subnet.",
          type: "string",
          required: true,
        },
        Cidr: {
          name: "Cidr",
          description: "The IPv4 or IPV6 CIDR range to reserve.",
          type: "string",
          required: true,
        },
        ReservationType: {
          name: "Reservation Type",
          description: "The type of reservation.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description:
            "The description to assign to the subnet CIDR reservation.",
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
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to assign to the subnet CIDR reservation.",
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

        const command = new CreateSubnetCidrReservationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Subnet Cidr Reservation Result",
      description: "Result from CreateSubnetCidrReservation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SubnetCidrReservation: {
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
              "Information about the created subnet CIDR reservation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createSubnetCidrReservation;
