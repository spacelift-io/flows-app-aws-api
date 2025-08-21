import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  RevokeSecurityGroupEgressCommand,
} from "@aws-sdk/client-ec2";

const revokeSecurityGroupEgress: AppBlock = {
  name: "Revoke Security Group Egress",
  description:
    "Removes the specified outbound (egress) rules from the specified security group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SecurityGroupRuleIds: {
          name: "Security Group Rule Ids",
          description: "The IDs of the security group rules.",
          type: {
            type: "array",
            items: {
              type: "string",
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
        GroupId: {
          name: "Group Id",
          description: "The ID of the security group.",
          type: "string",
          required: true,
        },
        SourceSecurityGroupName: {
          name: "Source Security Group Name",
          description: "Not supported.",
          type: "string",
          required: false,
        },
        SourceSecurityGroupOwnerId: {
          name: "Source Security Group Owner Id",
          description: "Not supported.",
          type: "string",
          required: false,
        },
        IpProtocol: {
          name: "Ip Protocol",
          description: "Not supported.",
          type: "string",
          required: false,
        },
        FromPort: {
          name: "From Port",
          description: "Not supported.",
          type: "number",
          required: false,
        },
        ToPort: {
          name: "To Port",
          description: "Not supported.",
          type: "number",
          required: false,
        },
        CidrIp: {
          name: "Cidr Ip",
          description: "Not supported.",
          type: "string",
          required: false,
        },
        IpPermissions: {
          name: "Ip Permissions",
          description: "The sets of IP permissions.",
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

        const command = new RevokeSecurityGroupEgressCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Revoke Security Group Egress Result",
      description: "Result from RevokeSecurityGroupEgress operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Returns true if the request succeeds; otherwise, returns an error.",
          },
          UnknownIpPermissions: {
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
            description: "The outbound rules that were unknown to the service.",
          },
          RevokedSecurityGroupRules: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SecurityGroupRuleId: {
                  type: "string",
                },
                GroupId: {
                  type: "string",
                },
                IsEgress: {
                  type: "boolean",
                },
                IpProtocol: {
                  type: "string",
                },
                FromPort: {
                  type: "number",
                },
                ToPort: {
                  type: "number",
                },
                CidrIpv4: {
                  type: "string",
                },
                CidrIpv6: {
                  type: "string",
                },
                PrefixListId: {
                  type: "string",
                },
                ReferencedGroupId: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Details about the revoked security group rules.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default revokeSecurityGroupEgress;
