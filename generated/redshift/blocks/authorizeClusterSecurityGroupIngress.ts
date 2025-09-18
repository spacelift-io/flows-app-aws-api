import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  AuthorizeClusterSecurityGroupIngressCommand,
} from "@aws-sdk/client-redshift";

const authorizeClusterSecurityGroupIngress: AppBlock = {
  name: "Authorize Cluster Security Group Ingress",
  description: `Adds an inbound (ingress) rule to an Amazon Redshift security group.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClusterSecurityGroupName: {
          name: "Cluster Security Group Name",
          description:
            "The name of the security group to which the ingress rule is added.",
          type: "string",
          required: true,
        },
        CIDRIP: {
          name: "CIDRIP",
          description:
            "The IP range to be added the Amazon Redshift security group.",
          type: "string",
          required: false,
        },
        EC2SecurityGroupName: {
          name: "EC2Security Group Name",
          description:
            "The EC2 security group to be added the Amazon Redshift security group.",
          type: "string",
          required: false,
        },
        EC2SecurityGroupOwnerId: {
          name: "EC2Security Group Owner Id",
          description:
            "The Amazon Web Services account number of the owner of the security group specified by the EC2SecurityGroupName parameter.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new AuthorizeClusterSecurityGroupIngressCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Authorize Cluster Security Group Ingress Result",
      description: "Result from AuthorizeClusterSecurityGroupIngress operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ClusterSecurityGroup: {
            type: "object",
            properties: {
              ClusterSecurityGroupName: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              EC2SecurityGroups: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Status: {
                      type: "string",
                    },
                    EC2SecurityGroupName: {
                      type: "string",
                    },
                    EC2SecurityGroupOwnerId: {
                      type: "string",
                    },
                    Tags: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
              IPRanges: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Status: {
                      type: "string",
                    },
                    CIDRIP: {
                      type: "string",
                    },
                    Tags: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
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
            description: "Describes a security group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default authorizeClusterSecurityGroupIngress;
