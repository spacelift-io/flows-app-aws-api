import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DeleteTransitGatewayCommand } from "@aws-sdk/client-ec2";

const deleteTransitGateway: AppBlock = {
  name: "Delete Transit Gateway",
  description: "Deletes the specified transit gateway.",
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

        const command = new DeleteTransitGatewayCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Transit Gateway Result",
      description: "Result from DeleteTransitGateway operation",
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
            description: "Information about the deleted transit gateway.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteTransitGateway;
