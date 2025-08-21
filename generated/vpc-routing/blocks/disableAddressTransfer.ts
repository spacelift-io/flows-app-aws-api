import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DisableAddressTransferCommand } from "@aws-sdk/client-ec2";

const disableAddressTransfer: AppBlock = {
  name: "Disable Address Transfer",
  description: "Disables Elastic IP address transfer.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AllocationId: {
          name: "Allocation Id",
          description: "The allocation ID of an Elastic IP address.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DisableAddressTransferCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disable Address Transfer Result",
      description: "Result from DisableAddressTransfer operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AddressTransfer: {
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
            description: "An Elastic IP address transfer.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disableAddressTransfer;
