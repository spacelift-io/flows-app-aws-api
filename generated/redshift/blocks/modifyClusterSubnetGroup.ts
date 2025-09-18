import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  ModifyClusterSubnetGroupCommand,
} from "@aws-sdk/client-redshift";

const modifyClusterSubnetGroup: AppBlock = {
  name: "Modify Cluster Subnet Group",
  description: `Modifies a cluster subnet group to include the specified list of VPC subnets.`,
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
          description: "The name of the subnet group to be modified.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "A text description of the subnet group to be modified.",
          type: "string",
          required: false,
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

        const command = new ModifyClusterSubnetGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Cluster Subnet Group Result",
      description: "Result from ModifyClusterSubnetGroup operation",
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

export default modifyClusterSubnetGroup;
