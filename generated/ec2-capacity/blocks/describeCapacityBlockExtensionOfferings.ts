import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeCapacityBlockExtensionOfferingsCommand,
} from "@aws-sdk/client-ec2";

const describeCapacityBlockExtensionOfferings: AppBlock = {
  name: "Describe Capacity Block Extension Offerings",
  description:
    "Describes Capacity Block extension offerings available for purchase in the Amazon Web Services Region that you're currently using.",
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
        CapacityBlockExtensionDurationHours: {
          name: "Capacity Block Extension Duration Hours",
          description:
            "The duration of the Capacity Block extension offering in hours.",
          type: "number",
          required: true,
        },
        CapacityReservationId: {
          name: "Capacity Reservation Id",
          description: "The ID of the Capacity reservation to be extended.",
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

        const command = new DescribeCapacityBlockExtensionOfferingsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Capacity Block Extension Offerings Result",
      description:
        "Result from DescribeCapacityBlockExtensionOfferings operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CapacityBlockExtensionOfferings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                CapacityBlockExtensionOfferingId: {
                  type: "string",
                },
                InstanceType: {
                  type: "string",
                },
                InstanceCount: {
                  type: "number",
                },
                AvailabilityZone: {
                  type: "string",
                },
                AvailabilityZoneId: {
                  type: "string",
                },
                StartDate: {
                  type: "string",
                },
                CapacityBlockExtensionStartDate: {
                  type: "string",
                },
                CapacityBlockExtensionEndDate: {
                  type: "string",
                },
                CapacityBlockExtensionDurationHours: {
                  type: "number",
                },
                UpfrontFee: {
                  type: "string",
                },
                CurrencyCode: {
                  type: "string",
                },
                Tenancy: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The recommended Capacity Block extension offerings for the dates specified.",
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

export default describeCapacityBlockExtensionOfferings;
