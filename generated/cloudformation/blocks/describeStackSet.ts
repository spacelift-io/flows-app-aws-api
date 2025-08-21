import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DescribeStackSetCommand,
} from "@aws-sdk/client-cloudformation";

const describeStackSet: AppBlock = {
  name: "Describe Stack Set",
  description: "Returns the description of the specified StackSet.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StackSetName: {
          name: "Stack Set Name",
          description:
            "The name or unique ID of the stack set whose description you want.",
          type: "string",
          required: true,
        },
        CallAs: {
          name: "Call As",
          description:
            "[Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account.",
          type: "string",
          required: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DescribeStackSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Stack Set Result",
      description: "Result from DescribeStackSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackSet: {
            type: "object",
            properties: {
              StackSetName: {
                type: "string",
              },
              StackSetId: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              TemplateBody: {
                type: "string",
              },
              Parameters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ParameterKey: {
                      type: "string",
                    },
                    ParameterValue: {
                      type: "string",
                    },
                    UsePreviousValue: {
                      type: "boolean",
                    },
                    ResolvedValue: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              Capabilities: {
                type: "array",
                items: {
                  type: "string",
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
                  required: ["Key", "Value"],
                  additionalProperties: false,
                },
              },
              StackSetARN: {
                type: "string",
              },
              AdministrationRoleARN: {
                type: "string",
              },
              ExecutionRoleName: {
                type: "string",
              },
              StackSetDriftDetectionDetails: {
                type: "object",
                properties: {
                  DriftStatus: {
                    type: "string",
                  },
                  DriftDetectionStatus: {
                    type: "string",
                  },
                  LastDriftCheckTimestamp: {
                    type: "string",
                  },
                  TotalStackInstancesCount: {
                    type: "number",
                  },
                  DriftedStackInstancesCount: {
                    type: "number",
                  },
                  InSyncStackInstancesCount: {
                    type: "number",
                  },
                  InProgressStackInstancesCount: {
                    type: "number",
                  },
                  FailedStackInstancesCount: {
                    type: "number",
                  },
                },
                additionalProperties: false,
              },
              AutoDeployment: {
                type: "object",
                properties: {
                  Enabled: {
                    type: "boolean",
                  },
                  RetainStacksOnAccountRemoval: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
              },
              PermissionModel: {
                type: "string",
              },
              OrganizationalUnitIds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              ManagedExecution: {
                type: "object",
                properties: {
                  Active: {
                    type: "boolean",
                  },
                },
                additionalProperties: false,
              },
              Regions: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
            description: "The specified stack set.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeStackSet;
