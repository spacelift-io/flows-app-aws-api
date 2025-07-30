import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, AcceptAddressTransferCommand } from "@aws-sdk/client-ec2";

const acceptAddressTransfer: AppBlock = {
  name: "Accept Address Transfer",
  description: "Accepts an Elastic IP address transfer.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Address: {
          name: "Address",
          description: "The Elastic IP address you are accepting for transfer.",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description:
            "tag: - The key/value combination of a tag assigned to the resource.",
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

        const command = new AcceptAddressTransferCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Accept Address Transfer Result",
      description: "Result from AcceptAddressTransfer operation",
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

export default acceptAddressTransfer;
