import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, GetSecurityGroupsForVpcCommand } from "@aws-sdk/client-ec2";

const getSecurityGroupsForVpc: AppBlock = {
  name: "Get Security Groups For Vpc",
  description:
    "Gets security groups that can be associated by the Amazon Web Services account making the request with network interfaces in the specified VPC.",
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
          description: "The VPC ID where the security group can be used.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description: "The token returned from a previous paginated request.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
          type: "number",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "The filters.",
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

        const command = new GetSecurityGroupsForVpcCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Security Groups For Vpc Result",
      description: "Result from GetSecurityGroupsForVpc operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
          SecurityGroupForVpcs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Description: {
                  type: "string",
                },
                GroupName: {
                  type: "string",
                },
                OwnerId: {
                  type: "string",
                },
                GroupId: {
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
                PrimaryVpcId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "The security group that can be used by interfaces in the VPC.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getSecurityGroupsForVpc;
