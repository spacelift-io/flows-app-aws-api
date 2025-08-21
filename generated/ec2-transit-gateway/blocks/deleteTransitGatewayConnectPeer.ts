import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteTransitGatewayConnectPeerCommand,
} from "@aws-sdk/client-ec2";

const deleteTransitGatewayConnectPeer: AppBlock = {
  name: "Delete Transit Gateway Connect Peer",
  description: "Deletes the specified Connect peer.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayConnectPeerId: {
          name: "Transit Gateway Connect Peer Id",
          description: "The ID of the Connect peer.",
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

        const command = new DeleteTransitGatewayConnectPeerCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Transit Gateway Connect Peer Result",
      description: "Result from DeleteTransitGatewayConnectPeer operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayConnectPeer: {
            type: "object",
            properties: {
              TransitGatewayAttachmentId: {
                type: "string",
              },
              TransitGatewayConnectPeerId: {
                type: "string",
              },
              State: {
                type: "string",
              },
              CreationTime: {
                type: "string",
              },
              ConnectPeerConfiguration: {
                type: "object",
                properties: {
                  TransitGatewayAddress: {
                    type: "string",
                  },
                  PeerAddress: {
                    type: "string",
                  },
                  InsideCidrBlocks: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  Protocol: {
                    type: "string",
                  },
                  BgpConfigurations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        TransitGatewayAsn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        PeerAsn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        TransitGatewayAddress: {
                          type: "object",
                          additionalProperties: true,
                        },
                        PeerAddress: {
                          type: "object",
                          additionalProperties: true,
                        },
                        BgpStatus: {
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
            description: "Information about the deleted Connect peer.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteTransitGatewayConnectPeer;
