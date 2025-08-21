import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateNetworkAclCommand } from "@aws-sdk/client-ec2";

const createNetworkAcl: AppBlock = {
  name: "Create Network Acl",
  description: "Creates a network ACL in a VPC.",
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
          description: "The tags to assign to the network ACL.",
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
          description: "The ID of the VPC.",
          type: "string",
          required: true,
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

        const command = new CreateNetworkAclCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Network Acl Result",
      description: "Result from CreateNetworkAcl operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NetworkAcl: {
            type: "object",
            properties: {
              Associations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    NetworkAclAssociationId: {
                      type: "string",
                    },
                    NetworkAclId: {
                      type: "string",
                    },
                    SubnetId: {
                      type: "string",
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
                      type: "string",
                    },
                    Egress: {
                      type: "boolean",
                    },
                    IcmpTypeCode: {
                      type: "object",
                      properties: {
                        Code: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Type: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    Ipv6CidrBlock: {
                      type: "string",
                    },
                    PortRange: {
                      type: "object",
                      properties: {
                        From: {
                          type: "object",
                          additionalProperties: true,
                        },
                        To: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    Protocol: {
                      type: "string",
                    },
                    RuleAction: {
                      type: "string",
                    },
                    RuleNumber: {
                      type: "number",
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
                      type: "string",
                    },
                    Value: {
                      type: "string",
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
            description: "Information about the network ACL.",
          },
          ClientToken: {
            type: "string",
            description:
              "Unique, case-sensitive identifier to ensure the idempotency of the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createNetworkAcl;
