import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeTransitGatewayConnectPeersCommand,
} from "@aws-sdk/client-ec2";

const describeTransitGatewayConnectPeers: AppBlock = {
  name: "Describe Transit Gateway Connect Peers",
  description: "Describes one or more Connect peers.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayConnectPeerIds: {
          name: "Transit Gateway Connect Peer Ids",
          description: "The IDs of the Connect peers.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
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
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return with a single call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next page of results.",
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

        const command = new DescribeTransitGatewayConnectPeersCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Transit Gateway Connect Peers Result",
      description: "Result from DescribeTransitGatewayConnectPeers operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayConnectPeers: {
            type: "array",
            items: {
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
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    Protocol: {
                      type: "string",
                    },
                    BgpConfigurations: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
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
            description: "Information about the Connect peers.",
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

export default describeTransitGatewayConnectPeers;
