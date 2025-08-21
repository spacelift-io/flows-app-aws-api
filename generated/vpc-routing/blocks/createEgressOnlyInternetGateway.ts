import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateEgressOnlyInternetGatewayCommand,
} from "@aws-sdk/client-ec2";

const createEgressOnlyInternetGateway: AppBlock = {
  name: "Create Egress Only Internet Gateway",
  description:
    "[IPv6 only] Creates an egress-only internet gateway for your VPC.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
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
        VpcId: {
          name: "Vpc Id",
          description:
            "The ID of the VPC for which to create the egress-only internet gateway.",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description:
            "The tags to assign to the egress-only internet gateway.",
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

        const command = new CreateEgressOnlyInternetGatewayCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Egress Only Internet Gateway Result",
      description: "Result from CreateEgressOnlyInternetGateway operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ClientToken: {
            type: "string",
            description:
              "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          },
          EgressOnlyInternetGateway: {
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
              EgressOnlyInternetGatewayId: {
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
            description: "Information about the egress-only internet gateway.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createEgressOnlyInternetGateway;
