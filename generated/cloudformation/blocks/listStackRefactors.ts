import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListStackRefactorsCommand,
} from "@aws-sdk/client-cloudformation";

const listStackRefactors: AppBlock = {
  name: "List Stack Refactors",
  description:
    "Lists all account stack refactor operations and their statuses.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ExecutionStatusFilter: {
          name: "Execution Status Filter",
          description: "Execution status to use as a filter.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "If the request doesn't return all the remaining results, NextToken is set to a token.",
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

        const command = new ListStackRefactorsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Stack Refactors Result",
      description: "Result from ListStackRefactors operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackRefactorSummaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                StackRefactorId: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                ExecutionStatus: {
                  type: "string",
                },
                ExecutionStatusReason: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusReason: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Provides a summary of a stack refactor, including the following: StackRefactorId Status StatusReason...",
          },
          NextToken: {
            type: "string",
            description:
              "If the request doesn't return all the remaining results, NextToken is set to a token.",
          },
        },
        required: ["StackRefactorSummaries"],
      },
    },
  },
};

export default listStackRefactors;
