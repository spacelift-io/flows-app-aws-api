import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  CreateVpcBlockPublicAccessExclusionCommand,
} from "@aws-sdk/client-ec2";

const createVpcBlockPublicAccessExclusion: AppBlock = {
  name: "Create Vpc Block Public Access Exclusion",
  description: "Create a VPC Block Public Access (BPA) exclusion.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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
        SubnetId: {
          name: "Subnet Id",
          description: "A subnet ID.",
          type: "string",
          required: false,
        },
        VpcId: {
          name: "Vpc Id",
          description: "A VPC ID.",
          type: "string",
          required: false,
        },
        InternetGatewayExclusionMode: {
          name: "Internet Gateway Exclusion Mode",
          description: "The exclusion mode for internet gateway traffic.",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description:
            "tag - The key/value combination of a tag assigned to the resource.",
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
        });

        const command = new CreateVpcBlockPublicAccessExclusionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Vpc Block Public Access Exclusion Result",
      description: "Result from CreateVpcBlockPublicAccessExclusion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpcBlockPublicAccessExclusion: {
            type: "object",
            properties: {
              ExclusionId: {
                type: "string",
              },
              InternetGatewayExclusionMode: {
                type: "string",
              },
              ResourceArn: {
                type: "string",
              },
              State: {
                type: "string",
              },
              Reason: {
                type: "string",
              },
              CreationTimestamp: {
                type: "string",
              },
              LastUpdateTimestamp: {
                type: "string",
              },
              DeletionTimestamp: {
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
            description: "Details about an exclusion.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createVpcBlockPublicAccessExclusion;
