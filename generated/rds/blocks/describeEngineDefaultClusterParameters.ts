import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeEngineDefaultClusterParametersCommand,
} from "@aws-sdk/client-rds";

const describeEngineDefaultClusterParameters: AppBlock = {
  name: "Describe Engine Default Cluster Parameters",
  description:
    "Returns the default engine and system parameter information for the cluster database engine.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DBParameterGroupFamily: {
          name: "DB Parameter Group Family",
          description:
            "The name of the DB cluster parameter group family to return engine parameter information for.",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description: "This parameter isn't currently supported.",
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
              required: ["Name", "Values"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous DescribeEngineDefaultClusterParameters request.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
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

        const command = new DescribeEngineDefaultClusterParametersCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Engine Default Cluster Parameters Result",
      description:
        "Result from DescribeEngineDefaultClusterParameters operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EngineDefaults: {
            type: "object",
            properties: {
              DBParameterGroupFamily: {
                type: "string",
              },
              Marker: {
                type: "string",
              },
              Parameters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ParameterName: {
                      type: "string",
                    },
                    ParameterValue: {
                      type: "string",
                    },
                    Description: {
                      type: "string",
                    },
                    Source: {
                      type: "string",
                    },
                    ApplyType: {
                      type: "string",
                    },
                    DataType: {
                      type: "string",
                    },
                    AllowedValues: {
                      type: "string",
                    },
                    IsModifiable: {
                      type: "boolean",
                    },
                    MinimumEngineVersion: {
                      type: "string",
                    },
                    ApplyMethod: {
                      type: "string",
                    },
                    SupportedEngineModes: {
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
            },
            additionalProperties: false,
            description:
              "Contains the result of a successful invocation of the DescribeEngineDefaultParameters action.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeEngineDefaultClusterParameters;
