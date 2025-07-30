import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateTransitGatewayCommand } from "@aws-sdk/client-ec2";

const createTransitGateway: AppBlock = {
  name: "Create Transit Gateway",
  description: "Creates a transit gateway.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "A description of the transit gateway.",
          type: "string",
          required: false,
        },
        Options: {
          name: "Options",
          description: "The transit gateway options.",
          type: {
            type: "object",
            properties: {
              AmazonSideAsn: {
                type: "number",
              },
              AutoAcceptSharedAttachments: {
                type: "string",
              },
              DefaultRouteTableAssociation: {
                type: "string",
              },
              DefaultRouteTablePropagation: {
                type: "string",
              },
              VpnEcmpSupport: {
                type: "string",
              },
              DnsSupport: {
                type: "string",
              },
              SecurityGroupReferencingSupport: {
                type: "string",
              },
              MulticastSupport: {
                type: "string",
              },
              TransitGatewayCidrBlocks: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to apply to the transit gateway.",
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

        const command = new CreateTransitGatewayCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Transit Gateway Result",
      description: "Result from CreateTransitGateway operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGateway: {
            type: "object",
            properties: {
              TransitGatewayId: {
                type: "string",
              },
              TransitGatewayArn: {
                type: "string",
              },
              State: {
                type: "string",
              },
              OwnerId: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              CreationTime: {
                type: "string",
              },
              Options: {
                type: "object",
                properties: {
                  AmazonSideAsn: {
                    type: "number",
                  },
                  TransitGatewayCidrBlocks: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  AutoAcceptSharedAttachments: {
                    type: "string",
                  },
                  DefaultRouteTableAssociation: {
                    type: "string",
                  },
                  AssociationDefaultRouteTableId: {
                    type: "string",
                  },
                  DefaultRouteTablePropagation: {
                    type: "string",
                  },
                  PropagationDefaultRouteTableId: {
                    type: "string",
                  },
                  VpnEcmpSupport: {
                    type: "string",
                  },
                  DnsSupport: {
                    type: "string",
                  },
                  SecurityGroupReferencingSupport: {
                    type: "string",
                  },
                  MulticastSupport: {
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
            description: "Information about the transit gateway.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createTransitGateway;
