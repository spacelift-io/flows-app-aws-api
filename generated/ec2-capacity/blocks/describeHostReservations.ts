import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeHostReservationsCommand,
} from "@aws-sdk/client-ec2";

const describeHostReservations: AppBlock = {
  name: "Describe Host Reservations",
  description:
    "Describes reservations that are associated with Dedicated Hosts in your account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Filter: {
          name: "Filter",
          description: "The filters.",
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
        HostReservationIdSet: {
          name: "Host Reservation Id Set",
          description: "The host reservation IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return for the request in a single page.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to use to retrieve the next page of results.",
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
        });

        const command = new DescribeHostReservationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Host Reservations Result",
      description: "Result from DescribeHostReservations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          HostReservationSet: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Count: {
                  type: "number",
                },
                CurrencyCode: {
                  type: "string",
                },
                Duration: {
                  type: "number",
                },
                End: {
                  type: "string",
                },
                HostIdSet: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                HostReservationId: {
                  type: "string",
                },
                HourlyPrice: {
                  type: "string",
                },
                InstanceFamily: {
                  type: "string",
                },
                OfferingId: {
                  type: "string",
                },
                PaymentOption: {
                  type: "string",
                },
                Start: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                UpfrontPrice: {
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
            description: "Details about the reservation's configuration.",
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

export default describeHostReservations;
