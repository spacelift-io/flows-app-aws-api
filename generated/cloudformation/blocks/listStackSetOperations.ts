import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListStackSetOperationsCommand,
} from "@aws-sdk/client-cloudformation";

const listStackSetOperations: AppBlock = {
  name: "List Stack Set Operations",
  description:
    "Returns summary information about operations performed on a stack set.",
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
            "The name or unique ID of the stack set that you want to get operation summaries for.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "If the previous paginated request didn't return all of the remaining results, the response object's NextToken parameter value is set to a token.",
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
        });

        const command = new ListStackSetOperationsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Stack Set Operations Result",
      description: "Result from ListStackSetOperations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Summaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                OperationId: {
                  type: "string",
                },
                Action: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                CreationTimestamp: {
                  type: "string",
                },
                EndTimestamp: {
                  type: "string",
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
                OperationPreferences: {
                  type: "object",
                  properties: {
                    RegionConcurrencyType: {
                      type: "string",
                    },
                    RegionOrder: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
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
              },
              additionalProperties: false,
            },
            description:
              "A list of StackSetOperationSummary structures that contain summary information about operations for the specified stack set.",
          },
          NextToken: {
            type: "string",
            description:
              "If the request doesn't return all results, NextToken is set to a token.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listStackSetOperations;
