import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  CreateClusterSecurityGroupCommand,
} from "@aws-sdk/client-redshift";

const createClusterSecurityGroup: AppBlock = {
  name: "Create Cluster Security Group",
  description: `Creates a new Amazon Redshift security group.`,
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
          description: "The name for the security group.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "A description for the security group.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "A list of tag instances.",
          type: {
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

        const command = new CreateClusterSecurityGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Cluster Security Group Result",
      description: "Result from CreateClusterSecurityGroup operation",
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

export default createClusterSecurityGroup;
