import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  BatchDescribeTypeConfigurationsCommand,
} from "@aws-sdk/client-cloudformation";

const batchDescribeTypeConfigurations: AppBlock = {
  name: "Batch Describe Type Configurations",
  description:
    "Returns configuration data for the specified CloudFormation extensions, from the CloudFormation registry for the account and Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TypeConfigurationIdentifiers: {
          name: "Type Configuration Identifiers",
          description:
            "The list of identifiers for the desired extension configurations.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TypeArn: {
                  type: "string",
                },
                TypeConfigurationAlias: {
                  type: "string",
                },
                TypeConfigurationArn: {
                  type: "string",
                },
                Type: {
                  type: "string",
                },
                TypeName: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new BatchDescribeTypeConfigurationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Batch Describe Type Configurations Result",
      description: "Result from BatchDescribeTypeConfigurations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ErrorCode: {
                  type: "string",
                },
                ErrorMessage: {
                  type: "string",
                },
                TypeConfigurationIdentifier: {
                  type: "object",
                  properties: {
                    TypeArn: {
                      type: "string",
                    },
                    TypeConfigurationAlias: {
                      type: "string",
                    },
                    TypeConfigurationArn: {
                      type: "string",
                    },
                    Type: {
                      type: "string",
                    },
                    TypeName: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of information concerning any errors generated during the setting of the specified configurations.",
          },
          UnprocessedTypeConfigurations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                TypeArn: {
                  type: "string",
                },
                TypeConfigurationAlias: {
                  type: "string",
                },
                TypeConfigurationArn: {
                  type: "string",
                },
                Type: {
                  type: "string",
                },
                TypeName: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of any of the specified extension configurations that CloudFormation could not process for any reason.",
          },
          TypeConfigurations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Arn: {
                  type: "string",
                },
                Alias: {
                  type: "string",
                },
                Configuration: {
                  type: "string",
                },
                LastUpdated: {
                  type: "string",
                },
                TypeArn: {
                  type: "string",
                },
                TypeName: {
                  type: "string",
                },
                IsDefaultConfiguration: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of any of the specified extension configurations from the CloudFormation registry.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default batchDescribeTypeConfigurations;
