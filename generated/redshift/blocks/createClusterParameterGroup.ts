import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  CreateClusterParameterGroupCommand,
} from "@aws-sdk/client-redshift";

const createClusterParameterGroup: AppBlock = {
  name: "Create Cluster Parameter Group",
  description: `Creates an Amazon Redshift parameter group.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ParameterGroupName: {
          name: "Parameter Group Name",
          description: "The name of the cluster parameter group.",
          type: "string",
          required: true,
        },
        ParameterGroupFamily: {
          name: "Parameter Group Family",
          description:
            "The Amazon Redshift engine version to which the cluster parameter group applies.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "A description of the parameter group.",
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

        const command = new CreateClusterParameterGroupCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Cluster Parameter Group Result",
      description: "Result from CreateClusterParameterGroup operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ClusterParameterGroup: {
            type: "object",
            properties: {
              ParameterGroupName: {
                type: "string",
              },
              ParameterGroupFamily: {
                type: "string",
              },
              Description: {
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
            },
            additionalProperties: false,
            description: "Describes a parameter group.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createClusterParameterGroup;
