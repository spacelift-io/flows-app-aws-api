import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DescribeStackSetOperationCommand,
} from "@aws-sdk/client-cloudformation";

const describeStackSetOperation: AppBlock = {
  name: "Describe Stack Set Operation",
  description: "Returns the description of the specified StackSet operation.",
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
            "The name or the unique stack ID of the stack set for the stack operation.",
          type: "string",
          required: true,
        },
        OperationId: {
          name: "Operation Id",
          description: "The unique ID of the stack set operation.",
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

        const command = new DescribeStackSetOperationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Stack Set Operation Result",
      description: "Result from DescribeStackSetOperation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackSetOperation: {
            type: "object",
            properties: {
              OperationId: {
                type: "string",
              },
              StackSetId: {
                type: "string",
              },
              Action: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              OperationPreferences: {
                type: "object",
                properties: {
                  RegionConcurrencyType: {
                    type: "string",
                  },
                  RegionOrder: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  FailureToleranceCount: {
                    type: "number",
                  },
                  FailureTolerancePercentage: {
                    type: "number",
                  },
                  MaxConcurrentCount: {
                    type: "number",
                  },
                  MaxConcurrentPercentage: {
                    type: "number",
                  },
                  ConcurrencyMode: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              RetainStacks: {
                type: "boolean",
              },
              AdministrationRoleARN: {
                type: "string",
              },
              ExecutionRoleName: {
                type: "string",
              },
              CreationTimestamp: {
                type: "string",
              },
              EndTimestamp: {
                type: "string",
              },
              DeploymentTargets: {
                type: "object",
                properties: {
                  Accounts: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  AccountsUrl: {
                    type: "string",
                  },
                  OrganizationalUnitIds: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  AccountFilterType: {
                    type: "string",
                  },
                },
                additionalProperties: false,
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
              StatusReason: {
                type: "string",
              },
              StatusDetails: {
                type: "object",
                properties: {
                  FailedStackInstancesCount: {
                    type: "number",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description: "The specified stack set operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeStackSetOperation;
