import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateInternetGatewayCommand } from "@aws-sdk/client-ec2";

const createInternetGateway: AppBlock = {
  name: "Create Internet Gateway",
  description: "Creates an internet gateway for use with a VPC.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to assign to the internet gateway.",
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

        const command = new CreateInternetGatewayCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Internet Gateway Result",
      description: "Result from CreateInternetGateway operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InternetGateway: {
            type: "object",
            properties: {
              Attachments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    State: {
                      type: "string",
                    },
                    VpcId: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              InternetGatewayId: {
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
            description: "Information about the internet gateway.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createInternetGateway;
