import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeDefaultClusterParametersCommand,
} from "@aws-sdk/client-redshift";

const describeDefaultClusterParameters: AppBlock = {
  name: "Describe Default Cluster Parameters",
  description: `Returns a list of parameter settings for the specified parameter group family.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ParameterGroupFamily: {
          name: "Parameter Group Family",
          description: "The name of the cluster parameter group family.",
          type: "string",
          required: true,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of response records to return in each call.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional parameter that specifies the starting point to return a set of response records.",
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

        const command = new DescribeDefaultClusterParametersCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Default Cluster Parameters Result",
      description: "Result from DescribeDefaultClusterParameters operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DefaultClusterParameters: {
            type: "object",
            properties: {
              ParameterGroupFamily: {
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
                    DataType: {
                      type: "string",
                    },
                    AllowedValues: {
                      type: "string",
                    },
                    ApplyType: {
                      type: "string",
                    },
                    IsModifiable: {
                      type: "boolean",
                    },
                    MinimumEngineVersion: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "Describes the default cluster parameters for a parameter group family.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDefaultClusterParameters;
