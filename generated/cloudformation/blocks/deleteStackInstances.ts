import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DeleteStackInstancesCommand,
} from "@aws-sdk/client-cloudformation";

const deleteStackInstances: AppBlock = {
  name: "Delete Stack Instances",
  description:
    "Deletes stack instances for the specified accounts, in the specified Amazon Web Services Regions.",
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
            "The name or unique ID of the stack set that you want to delete stack instances for.",
          type: "string",
          required: true,
        },
        Accounts: {
          name: "Accounts",
          description:
            "[Self-managed permissions] The account IDs of the Amazon Web Services accounts that you want to delete stack instances for.",
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
            "[Service-managed permissions] The Organizations accounts from which to delete stack instances.",
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
            "The Amazon Web Services Regions where you want to delete stack set instances.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
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
        RetainStacks: {
          name: "Retain Stacks",
          description:
            "Removes the stack instances from the specified stack set, but doesn't delete the stacks.",
          type: "boolean",
          required: true,
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

        const command = new DeleteStackInstancesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Stack Instances Result",
      description: "Result from DeleteStackInstances operation",
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

export default deleteStackInstances;
