import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListStackSetsCommand,
} from "@aws-sdk/client-cloudformation";

const listStackSets: AppBlock = {
  name: "List Stack Sets",
  description:
    "Returns summary information about stack sets that are associated with the user.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "If the previous paginated request didn't return all the remaining results, the response object's NextToken parameter value is set to a token.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to be returned with a single call.",
          type: "number",
          required: false,
        },
        Status: {
          name: "Status",
          description:
            "The status of the stack sets that you want to get summary information about.",
          type: "string",
          required: false,
        },
        CallAs: {
          name: "Call As",
          description:
            "[Service-managed permissions] Specifies whether you are acting as an account administrator in the management account or as a delegated administrator in a member account.",
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

        const command = new ListStackSetsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Stack Sets Result",
      description: "Result from ListStackSets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Summaries: {
            type: "array",
            items: {
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
                DriftStatus: {
                  type: "string",
                },
                LastDriftCheckTimestamp: {
                  type: "string",
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
              },
              additionalProperties: false,
            },
            description:
              "A list of StackSetSummary structures that contain information about the user's stack sets.",
          },
          NextToken: {
            type: "string",
            description:
              "If the request doesn't return all of the remaining results, NextToken is set to a token.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listStackSets;
