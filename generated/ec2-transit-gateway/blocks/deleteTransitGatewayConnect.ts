import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteTransitGatewayConnectCommand,
} from "@aws-sdk/client-ec2";

const deleteTransitGatewayConnect: AppBlock = {
  name: "Delete Transit Gateway Connect",
  description: "Deletes the specified Connect attachment.",
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
          description: "The ID of the Connect attachment.",
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

        const command = new DeleteTransitGatewayConnectCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Transit Gateway Connect Result",
      description: "Result from DeleteTransitGatewayConnect operation",
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
            description: "Information about the deleted Connect attachment.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteTransitGatewayConnect;
