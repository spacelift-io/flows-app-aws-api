import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListStacksCommand,
} from "@aws-sdk/client-cloudformation";

const listStacks: AppBlock = {
  name: "List Stacks",
  description:
    "Returns the summary information for stacks whose status matches the specified StackStatusFilter.",
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
            "A string that identifies the next page of stacks that you want to retrieve.",
          type: "string",
          required: false,
        },
        StackStatusFilter: {
          name: "Stack Status Filter",
          description: "Stack status to use as a filter.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
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

        const command = new ListStacksCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Stacks Result",
      description: "Result from ListStacks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackSummaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                StackId: {
                  type: "string",
                },
                StackName: {
                  type: "string",
                },
                TemplateDescription: {
                  type: "string",
                },
                CreationTime: {
                  type: "string",
                },
                LastUpdatedTime: {
                  type: "string",
                },
                DeletionTime: {
                  type: "string",
                },
                StackStatus: {
                  type: "string",
                },
                StackStatusReason: {
                  type: "string",
                },
                ParentId: {
                  type: "string",
                },
                RootId: {
                  type: "string",
                },
                DriftInformation: {
                  type: "object",
                  properties: {
                    StackDriftStatus: {
                      type: "string",
                    },
                    LastCheckTimestamp: {
                      type: "string",
                    },
                  },
                  required: ["StackDriftStatus"],
                  additionalProperties: false,
                },
              },
              required: ["StackName", "CreationTime", "StackStatus"],
              additionalProperties: false,
            },
            description:
              "A list of StackSummary structures that contains information about the specified stacks.",
          },
          NextToken: {
            type: "string",
            description:
              "If the output exceeds 1 MB in size, a string that identifies the next page of stacks.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listStacks;
