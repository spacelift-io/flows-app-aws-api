import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeTransitGatewaysCommand } from "@aws-sdk/client-ec2";

const describeTransitGateways: AppBlock = {
  name: "Describe Transit Gateways",
  description: "Describes one or more transit gateways.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayIds: {
          name: "Transit Gateway Ids",
          description: "The IDs of the transit gateways.",
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

        const command = new DescribeTransitGatewaysCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Transit Gateways Result",
      description: "Result from DescribeTransitGateways operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGateways: {
            type: "array",
            items: {
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
                        type: "object",
                        additionalProperties: true,
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
            description: "Information about the transit gateways.",
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

export default describeTransitGateways;
