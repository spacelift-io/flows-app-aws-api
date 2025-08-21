import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  RejectTransitGatewayPeeringAttachmentCommand,
} from "@aws-sdk/client-ec2";

const rejectTransitGatewayPeeringAttachment: AppBlock = {
  name: "Reject Transit Gateway Peering Attachment",
  description: "Rejects a transit gateway peering attachment request.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayAttachmentId: {
          name: "Transit Gateway Attachment Id",
          description: "The ID of the transit gateway peering attachment.",
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

        const command = new RejectTransitGatewayPeeringAttachmentCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Reject Transit Gateway Peering Attachment Result",
      description:
        "Result from RejectTransitGatewayPeeringAttachment operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayPeeringAttachment: {
            type: "object",
            properties: {
              TransitGatewayAttachmentId: {
                type: "string",
              },
              AccepterTransitGatewayAttachmentId: {
                type: "string",
              },
              RequesterTgwInfo: {
                type: "object",
                properties: {
                  TransitGatewayId: {
                    type: "string",
                  },
                  CoreNetworkId: {
                    type: "string",
                  },
                  OwnerId: {
                    type: "string",
                  },
                  Region: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              AccepterTgwInfo: {
                type: "object",
                properties: {
                  TransitGatewayId: {
                    type: "string",
                  },
                  CoreNetworkId: {
                    type: "string",
                  },
                  OwnerId: {
                    type: "string",
                  },
                  Region: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              Options: {
                type: "object",
                properties: {
                  DynamicRouting: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              Status: {
                type: "object",
                properties: {
                  Code: {
                    type: "string",
                  },
                  Message: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              State: {
                type: "string",
              },
              CreationTime: {
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
            description: "The transit gateway peering attachment.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default rejectTransitGatewayPeeringAttachment;
