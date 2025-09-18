import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  CreateClusterSubnetGroupCommand,
} from "@aws-sdk/client-redshift";

const createClusterSubnetGroup: AppBlock = {
  name: "Create Cluster Subnet Group",
  description: `Creates a new Amazon Redshift subnet group.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ClusterSubnetGroupName: {
          name: "Cluster Subnet Group Name",
          description: "The name for the subnet group.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "A description for the subnet group.",
          type: "string",
          required: true,
        },
        SubnetIds: {
          name: "Subnet Ids",
          description: "An array of VPC subnet IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new CreateClusterSubnetGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Cluster Subnet Group Result",
      description: "Result from CreateClusterSubnetGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ClusterSubnetGroup: {
            type: "object",
            properties: {
              ClusterSubnetGroupName: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              VpcId: {
                type: "string",
              },
              SubnetGroupStatus: {
                type: "string",
              },
              Subnets: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    SubnetIdentifier: {
                      type: "string",
                    },
                    SubnetAvailabilityZone: {
                      type: "object",
                      properties: {
                        Name: {
                          type: "object",
                          additionalProperties: true,
                        },
                        SupportedPlatforms: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    SubnetStatus: {
                      type: "string",
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
              SupportedClusterIpAddressTypes: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
            description: "Describes a subnet group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createClusterSubnetGroup;
