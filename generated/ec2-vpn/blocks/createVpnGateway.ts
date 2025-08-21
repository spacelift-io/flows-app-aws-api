import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateVpnGatewayCommand } from "@aws-sdk/client-ec2";

const createVpnGateway: AppBlock = {
  name: "Create Vpn Gateway",
  description: "Creates a virtual private gateway.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AvailabilityZone: {
          name: "Availability Zone",
          description: "The Availability Zone for the virtual private gateway.",
          type: "string",
          required: false,
        },
        Type: {
          name: "Type",
          description:
            "The type of VPN connection this virtual private gateway supports.",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to apply to the virtual private gateway.",
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
        AmazonSideAsn: {
          name: "Amazon Side Asn",
          description:
            "A private Autonomous System Number (ASN) for the Amazon side of a BGP session.",
          type: "number",
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

        const command = new CreateVpnGatewayCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Vpn Gateway Result",
      description: "Result from CreateVpnGateway operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpnGateway: {
            type: "object",
            properties: {
              AmazonSideAsn: {
                type: "number",
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
              VpnGatewayId: {
                type: "string",
              },
              State: {
                type: "string",
              },
              Type: {
                type: "string",
              },
              AvailabilityZone: {
                type: "string",
              },
              VpcAttachments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    VpcId: {
                      type: "string",
                    },
                    State: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "Information about the virtual private gateway.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createVpnGateway;
