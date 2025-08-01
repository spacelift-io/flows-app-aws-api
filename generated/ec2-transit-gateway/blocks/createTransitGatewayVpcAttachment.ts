import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateTransitGatewayVpcAttachmentCommand,
} from "@aws-sdk/client-ec2";

const createTransitGatewayVpcAttachment: AppBlock = {
  name: "Create Transit Gateway Vpc Attachment",
  description: "Attaches the specified VPC to the specified transit gateway.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayId: {
          name: "Transit Gateway Id",
          description: "The ID of the transit gateway.",
          type: "string",
          required: true,
        },
        VpcId: {
          name: "Vpc Id",
          description: "The ID of the VPC.",
          type: "string",
          required: true,
        },
        SubnetIds: {
          name: "Subnet Ids",
          description: "The IDs of one or more subnets.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        Options: {
          name: "Options",
          description: "The VPC attachment options.",
          type: {
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
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to apply to the VPC attachment.",
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

        const command = new CreateTransitGatewayVpcAttachmentCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Transit Gateway Vpc Attachment Result",
      description: "Result from CreateTransitGatewayVpcAttachment operation",
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
            description: "Information about the VPC attachment.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createTransitGatewayVpcAttachment;
