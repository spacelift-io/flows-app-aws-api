import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribeBlueGreenDeploymentsCommand,
} from "@aws-sdk/client-rds";

const describeBlueGreenDeployments: AppBlock = {
  name: "Describe Blue Green Deployments",
  description: "Describes one or more blue/green deployments.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        BlueGreenDeploymentIdentifier: {
          name: "Blue Green Deployment Identifier",
          description: "The blue/green deployment identifier.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "A filter that specifies one or more blue/green deployments to describe.",
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
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous DescribeBlueGreenDeployments request.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
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
        });

        const command = new DescribeBlueGreenDeploymentsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Blue Green Deployments Result",
      description: "Result from DescribeBlueGreenDeployments operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BlueGreenDeployments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                BlueGreenDeploymentIdentifier: {
                  type: "string",
                },
                BlueGreenDeploymentName: {
                  type: "string",
                },
                Source: {
                  type: "string",
                },
                Target: {
                  type: "string",
                },
                SwitchoverDetails: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      SourceMember: {
                        type: "object",
                        additionalProperties: true,
                      },
                      TargetMember: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Status: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                Tasks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Name: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Status: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                Status: {
                  type: "string",
                },
                StatusDetails: {
                  type: "string",
                },
                CreateTime: {
                  type: "string",
                },
                DeleteTime: {
                  type: "string",
                },
                TagList: {
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
            description:
              "A list of blue/green deployments in the current account and Amazon Web Services Region.",
          },
          Marker: {
            type: "string",
            description:
              "A pagination token that can be used in a later DescribeBlueGreenDeployments request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeBlueGreenDeployments;
