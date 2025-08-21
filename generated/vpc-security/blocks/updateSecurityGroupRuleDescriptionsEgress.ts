import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  UpdateSecurityGroupRuleDescriptionsEgressCommand,
} from "@aws-sdk/client-ec2";

const updateSecurityGroupRuleDescriptionsEgress: AppBlock = {
  name: "Update Security Group Rule Descriptions Egress",
  description:
    "Updates the description of an egress (outbound) security group rule.",
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
        GroupId: {
          name: "Group Id",
          description: "The ID of the security group.",
          type: "string",
          required: false,
        },
        GroupName: {
          name: "Group Name",
          description: "[Default VPC] The name of the security group.",
          type: "string",
          required: false,
        },
        IpPermissions: {
          name: "Ip Permissions",
          description: "The IP permissions for the security group rule.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                IpProtocol: {
                  type: "string",
                },
                FromPort: {
                  type: "number",
                },
                ToPort: {
                  type: "number",
                },
                UserIdGroupPairs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Description: {
                        type: "object",
                        additionalProperties: true,
                      },
                      UserId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      GroupName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      GroupId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      VpcId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      VpcPeeringConnectionId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PeeringStatus: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                IpRanges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Description: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CidrIp: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                Ipv6Ranges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Description: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CidrIpv6: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                PrefixListIds: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Description: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PrefixListId: {
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
        SecurityGroupRuleDescriptions: {
          name: "Security Group Rule Descriptions",
          description: "The description for the egress security group rules.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SecurityGroupRuleId: {
                  type: "string",
                },
                Description: {
                  type: "string",
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

        const command = new UpdateSecurityGroupRuleDescriptionsEgressCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Security Group Rule Descriptions Egress Result",
      description:
        "Result from UpdateSecurityGroupRuleDescriptionsEgress operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Returns true if the request succeeds; otherwise, returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateSecurityGroupRuleDescriptionsEgress;
