import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateTransitGatewayMulticastDomainCommand,
} from "@aws-sdk/client-ec2";

const createTransitGatewayMulticastDomain: AppBlock = {
  name: "Create Transit Gateway Multicast Domain",
  description:
    "Creates a multicast domain using the specified transit gateway.",
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
        Options: {
          name: "Options",
          description: "The options for the transit gateway multicast domain.",
          type: {
            type: "object",
            properties: {
              Igmpv2Support: {
                type: "string",
              },
              StaticSourcesSupport: {
                type: "string",
              },
              AutoAcceptSharedAssociations: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags for the transit gateway multicast domain.",
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

        const command = new CreateTransitGatewayMulticastDomainCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Transit Gateway Multicast Domain Result",
      description: "Result from CreateTransitGatewayMulticastDomain operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayMulticastDomain: {
            type: "object",
            properties: {
              TransitGatewayMulticastDomainId: {
                type: "string",
              },
              TransitGatewayId: {
                type: "string",
              },
              TransitGatewayMulticastDomainArn: {
                type: "string",
              },
              OwnerId: {
                type: "string",
              },
              Options: {
                type: "object",
                properties: {
                  Igmpv2Support: {
                    type: "string",
                  },
                  StaticSourcesSupport: {
                    type: "string",
                  },
                  AutoAcceptSharedAssociations: {
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
            description:
              "Information about the transit gateway multicast domain.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createTransitGatewayMulticastDomain;
