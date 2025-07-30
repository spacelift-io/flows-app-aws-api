import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListHookResultsCommand,
} from "@aws-sdk/client-cloudformation";

const listHookResults: AppBlock = {
  name: "List Hook Results",
  description:
    "Returns summaries of invoked Hooks when a change set or Cloud Control API operation target is provided.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TargetType: {
          name: "Target Type",
          description: "The type of operation being targeted by the Hook.",
          type: "string",
          required: true,
        },
        TargetId: {
          name: "Target Id",
          description:
            "The logical ID of the target the operation is acting on by the Hook.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A string that identifies the next page of events that you want to retrieve.",
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

        const command = new ListHookResultsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Hook Results Result",
      description: "Result from ListHookResults operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TargetType: {
            type: "string",
            description: "The type of operation being targeted by the Hook.",
          },
          TargetId: {
            type: "string",
            description:
              "The logical ID of the target the operation is acting on by the Hook.",
          },
          HookResults: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InvocationPoint: {
                  type: "string",
                },
                FailureMode: {
                  type: "string",
                },
                TypeName: {
                  type: "string",
                },
                TypeVersionId: {
                  type: "string",
                },
                TypeConfigurationVersionId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                HookStatusReason: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of HookResultSummary structures that provides the status and Hook status reason for each Hook invocation for the specified target.",
          },
          NextToken: {
            type: "string",
            description: "Pagination token, null or empty if no more results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listHookResults;
