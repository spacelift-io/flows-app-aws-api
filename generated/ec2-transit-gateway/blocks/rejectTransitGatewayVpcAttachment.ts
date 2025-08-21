import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  RejectTransitGatewayVpcAttachmentCommand,
} from "@aws-sdk/client-ec2";

const rejectTransitGatewayVpcAttachment: AppBlock = {
  name: "Reject Transit Gateway Vpc Attachment",
  description: "Rejects a request to attach a VPC to a transit gateway.",
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
          description: "The ID of the attachment.",
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

        const command = new RejectTransitGatewayVpcAttachmentCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Reject Transit Gateway Vpc Attachment Result",
      description: "Result from RejectTransitGatewayVpcAttachment operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayVpcAttachment: {
            type: "object",
            properties: {
              TransitGatewayAttachmentId: {
                type: "string",
              },
              TransitGatewayId: {
                type: "string",
              },
              VpcId: {
                type: "string",
              },
              VpcOwnerId: {
                type: "string",
              },
              State: {
                type: "string",
              },
              SubnetIds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              CreationTime: {
                type: "string",
              },
              Options: {
                type: "object",
                properties: {
                  DnsSupport: {
                    type: "string",
                  },
                  SecurityGroupReferencingSupport: {
                    type: "string",
                  },
                  Ipv6Support: {
                    type: "string",
                  },
                  ApplianceModeSupport: {
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
            description: "Information about the attachment.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default rejectTransitGatewayVpcAttachment;
