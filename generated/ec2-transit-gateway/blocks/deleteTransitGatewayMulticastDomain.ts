import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteTransitGatewayMulticastDomainCommand,
} from "@aws-sdk/client-ec2";

const deleteTransitGatewayMulticastDomain: AppBlock = {
  name: "Delete Transit Gateway Multicast Domain",
  description: "Deletes the specified transit gateway multicast domain.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayMulticastDomainId: {
          name: "Transit Gateway Multicast Domain Id",
          description: "The ID of the transit gateway multicast domain.",
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

        const command = new DeleteTransitGatewayMulticastDomainCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Transit Gateway Multicast Domain Result",
      description: "Result from DeleteTransitGatewayMulticastDomain operation",
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
              "Information about the deleted transit gateway multicast domain.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteTransitGatewayMulticastDomain;
