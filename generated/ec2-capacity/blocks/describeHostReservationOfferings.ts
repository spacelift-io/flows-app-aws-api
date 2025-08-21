import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeHostReservationOfferingsCommand,
} from "@aws-sdk/client-ec2";

const describeHostReservationOfferings: AppBlock = {
  name: "Describe Host Reservation Offerings",
  description:
    "Describes the Dedicated Host reservations that are available to purchase.",
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
        MaxDuration: {
          name: "Max Duration",
          description:
            "This is the maximum duration of the reservation to purchase, specified in seconds.",
          type: "number",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return for the request in a single page.",
          type: "number",
          required: false,
        },
        MinDuration: {
          name: "Min Duration",
          description:
            "This is the minimum duration of the reservation you'd like to purchase, specified in seconds.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to use to retrieve the next page of results.",
          type: "string",
          required: false,
        },
        OfferingId: {
          name: "Offering Id",
          description: "The ID of the reservation offering.",
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

        const command = new DescribeHostReservationOfferingsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Host Reservation Offerings Result",
      description: "Result from DescribeHostReservationOfferings operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
          OfferingSet: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CurrencyCode: {
                  type: "string",
                },
                Duration: {
                  type: "number",
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
                UpfrontPrice: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the offerings.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeHostReservationOfferings;
