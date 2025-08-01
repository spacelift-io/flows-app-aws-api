import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetSubnetCidrReservationsCommand,
} from "@aws-sdk/client-ec2";

const getSubnetCidrReservations: AppBlock = {
  name: "Get Subnet Cidr Reservations",
  description: "Gets information about the subnet CIDR reservations.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
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
        SubnetId: {
          name: "Subnet Id",
          description: "The ID of the subnet.",
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
        NextToken: {
          name: "Next Token",
          description: "The token for the next page of results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return with a single call.",
          type: "number",
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

        const command = new GetSubnetCidrReservationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Subnet Cidr Reservations Result",
      description: "Result from GetSubnetCidrReservations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SubnetIpv4CidrReservations: {
            type: "array",
            items: {
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
            description: "Information about the IPv4 subnet CIDR reservations.",
          },
          SubnetIpv6CidrReservations: {
            type: "array",
            items: {
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
            description: "Information about the IPv6 subnet CIDR reservations.",
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

export default getSubnetCidrReservations;
