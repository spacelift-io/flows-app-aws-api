import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeNetworkAclsCommand } from "@aws-sdk/client-ec2";

const describeNetworkAcls: AppBlock = {
  name: "Describe Network Acls",
  description: "Describes your network ACLs.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        NetworkAclIds: {
          name: "Network Acl Ids",
          description: "The IDs of the network ACLs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new DescribeNetworkAclsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Network Acls Result",
      description: "Result from DescribeNetworkAcls operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NetworkAcls: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Associations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      NetworkAclAssociationId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NetworkAclId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SubnetId: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                Entries: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      CidrBlock: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Egress: {
                        type: "object",
                        additionalProperties: true,
                      },
                      IcmpTypeCode: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Ipv6CidrBlock: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PortRange: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Protocol: {
                        type: "object",
                        additionalProperties: true,
                      },
                      RuleAction: {
                        type: "object",
                        additionalProperties: true,
                      },
                      RuleNumber: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                IsDefault: {
                  type: "boolean",
                },
                NetworkAclId: {
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
                VpcId: {
                  type: "string",
                },
                OwnerId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the network ACLs.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeNetworkAcls;
