import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListChangeSetsCommand,
} from "@aws-sdk/client-cloudformation";

const listChangeSets: AppBlock = {
  name: "List Change Sets",
  description:
    "Returns the ID and status of each active change set for a stack.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StackName: {
          name: "Stack Name",
          description:
            "The name or the Amazon Resource Name (ARN) of the stack for which you want to list change sets.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A string (provided by the ListChangeSets response output) that identifies the next page of change sets that you want to retrieve.",
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

        const command = new ListChangeSetsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Change Sets Result",
      description: "Result from ListChangeSets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Summaries: {
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
                ChangeSetId: {
                  type: "string",
                },
                ChangeSetName: {
                  type: "string",
                },
                ExecutionStatus: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusReason: {
                  type: "string",
                },
                CreationTime: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                IncludeNestedStacks: {
                  type: "boolean",
                },
                ParentChangeSetId: {
                  type: "string",
                },
                RootChangeSetId: {
                  type: "string",
                },
                ImportExistingResources: {
                  type: "boolean",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of ChangeSetSummary structures that provides the ID and status of each change set for the specified stack.",
          },
          NextToken: {
            type: "string",
            description:
              "If the output exceeds 1 MB, a string that identifies the next page of change sets.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listChangeSets;
