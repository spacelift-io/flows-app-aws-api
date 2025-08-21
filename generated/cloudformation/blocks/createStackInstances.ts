import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  CreateStackInstancesCommand,
} from "@aws-sdk/client-cloudformation";

const createStackInstances: AppBlock = {
  name: "Create Stack Instances",
  description:
    "Creates stack instances for the specified accounts, within the specified Amazon Web Services Regions.",
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
            "The name or unique ID of the stack set that you want to create stack instances from.",
          type: "string",
          required: true,
        },
        Accounts: {
          name: "Accounts",
          description:
            "[Self-managed permissions] The account IDs of one or more Amazon Web Services accounts that you want to create stack instances in the specified Region(s) for.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        DeploymentTargets: {
          name: "Deployment Targets",
          description:
            "[Service-managed permissions] The Organizations accounts for which to create stack instances in the specified Amazon Web Services Regions.",
          type: {
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
          required: false,
        },
        Regions: {
          name: "Regions",
          description:
            "The names of one or more Amazon Web Services Regions where you want to create stack instances using the specified Amazon Web Services accounts.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        ParameterOverrides: {
          name: "Parameter Overrides",
          description:
            "A list of stack set parameters whose values you want to override in the selected stack instances.",
          type: {
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
          required: false,
        },
        OperationPreferences: {
          name: "Operation Preferences",
          description:
            "Preferences for how CloudFormation performs this stack set operation.",
          type: {
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
          required: false,
        },
        OperationId: {
          name: "Operation Id",
          description: "The unique identifier for this stack set operation.",
          type: "string",
          required: false,
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

        const command = new CreateStackInstancesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Stack Instances Result",
      description: "Result from CreateStackInstances operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OperationId: {
            type: "string",
            description: "The unique identifier for this stack set operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createStackInstances;
