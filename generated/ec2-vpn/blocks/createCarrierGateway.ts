import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateCarrierGatewayCommand } from "@aws-sdk/client-ec2";

const createCarrierGateway: AppBlock = {
  name: "Create Carrier Gateway",
  description: "Creates a carrier gateway.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        VpcId: {
          name: "Vpc Id",
          description:
            "The ID of the VPC to associate with the carrier gateway.",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to associate with the carrier gateway.",
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
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
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

        const command = new CreateCarrierGatewayCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Carrier Gateway Result",
      description: "Result from CreateCarrierGateway operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CarrierGateway: {
            type: "object",
            properties: {
              CarrierGatewayId: {
                type: "string",
              },
              VpcId: {
                type: "string",
              },
              State: {
                type: "string",
              },
              OwnerId: {
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
            description: "Information about the carrier gateway.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createCarrierGateway;
