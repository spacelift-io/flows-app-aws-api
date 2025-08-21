import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListStackSetOperationResultsCommand,
} from "@aws-sdk/client-cloudformation";

const listStackSetOperationResults: AppBlock = {
  name: "List Stack Set Operation Results",
  description:
    "Returns summary information about the results of a stack set operation.",
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
            "The name or unique ID of the stack set that you want to get operation results for.",
          type: "string",
          required: true,
        },
        OperationId: {
          name: "Operation Id",
          description: "The ID of the stack set operation.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "If the previous request didn't return all the remaining results, the response object's NextToken parameter value is set to a token.",
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
        Filters: {
          name: "Filters",
          description: "The filter to apply to operation results.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "string",
                },
              },
              additionalProperties: false,
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

        const command = new ListStackSetOperationResultsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Stack Set Operation Results Result",
      description: "Result from ListStackSetOperationResults operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Summaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Account: {
                  type: "string",
                },
                Region: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusReason: {
                  type: "string",
                },
                AccountGateResult: {
                  type: "object",
                  properties: {
                    Status: {
                      type: "string",
                    },
                    StatusReason: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                OrganizationalUnitId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of StackSetOperationResultSummary structures that contain information about the specified operation results, for accounts and Amazon Web Services Regions that are included in the operation.",
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

export default listStackSetOperationResults;
