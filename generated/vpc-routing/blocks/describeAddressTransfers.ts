import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeAddressTransfersCommand,
} from "@aws-sdk/client-ec2";

const describeAddressTransfers: AppBlock = {
  name: "Describe Address Transfers",
  description: "Describes an Elastic IP address transfer.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AllocationIds: {
          name: "Allocation Ids",
          description: "The allocation IDs of Elastic IP addresses.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "Specify the pagination token from a previous request to retrieve the next page of results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of address transfers to return in one page of results.",
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

        const command = new DescribeAddressTransfersCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Address Transfers Result",
      description: "Result from DescribeAddressTransfers operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AddressTransfers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                PublicIp: {
                  type: "string",
                },
                AllocationId: {
                  type: "string",
                },
                TransferAccountId: {
                  type: "string",
                },
                TransferOfferExpirationTimestamp: {
                  type: "string",
                },
                TransferOfferAcceptedTimestamp: {
                  type: "string",
                },
                AddressTransferStatus: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The Elastic IP address transfer.",
          },
          NextToken: {
            type: "string",
            description:
              "Specify the pagination token from a previous request to retrieve the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAddressTransfers;
