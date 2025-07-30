import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateSecurityGroupCommand } from "@aws-sdk/client-ec2";

const createSecurityGroup: AppBlock = {
  name: "Create Security Group",
  description: "Creates a security group.",
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
          description: "A description for the security group.",
          type: "string",
          required: true,
        },
        GroupName: {
          name: "Group Name",
          description: "The name of the security group.",
          type: "string",
          required: true,
        },
        VpcId: {
          name: "Vpc Id",
          description: "The ID of the VPC.",
          type: "string",
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to assign to the security group.",
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

        const command = new CreateSecurityGroupCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Security Group Result",
      description: "Result from CreateSecurityGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          GroupId: {
            type: "string",
            description: "The ID of the security group.",
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
            description: "The tags assigned to the security group.",
          },
          SecurityGroupArn: {
            type: "string",
            description: "The security group ARN.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createSecurityGroup;
