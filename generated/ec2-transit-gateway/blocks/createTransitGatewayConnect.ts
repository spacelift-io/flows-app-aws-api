import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateTransitGatewayConnectCommand,
} from "@aws-sdk/client-ec2";

const createTransitGatewayConnect: AppBlock = {
  name: "Create Transit Gateway Connect",
  description:
    "Creates a Connect attachment from a specified transit gateway attachment.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransportTransitGatewayAttachmentId: {
          name: "Transport Transit Gateway Attachment Id",
          description: "The ID of the transit gateway attachment.",
          type: "string",
          required: true,
        },
        Options: {
          name: "Options",
          description: "The Connect attachment options.",
          type: {
            type: "object",
            properties: {
              Protocol: {
                type: "string",
              },
            },
            required: ["Protocol"],
            additionalProperties: false,
          },
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to apply to the Connect attachment.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateTransitGatewayConnectCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Transit Gateway Connect Result",
      description: "Result from CreateTransitGatewayConnect operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayConnect: {
            type: "object",
            properties: {
              TransitGatewayAttachmentId: {
                type: "string",
              },
              TransportTransitGatewayAttachmentId: {
                type: "string",
              },
              TransitGatewayId: {
                type: "string",
              },
              State: {
                type: "string",
              },
              CreationTime: {
                type: "string",
              },
              Options: {
                type: "object",
                properties: {
                  Protocol: {
                    type: "string",
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
            description: "Information about the Connect attachment.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createTransitGatewayConnect;
