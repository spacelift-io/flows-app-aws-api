import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListStackInstancesCommand,
} from "@aws-sdk/client-cloudformation";

const listStackInstances: AppBlock = {
  name: "List Stack Instances",
  description:
    "Returns summary information about stack instances that are associated with the specified stack set.",
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
            "The name or unique ID of the stack set that you want to list stack instances for.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "If the previous request didn't return all the remaining results, the response's NextToken parameter value is set to a token.",
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
        Filters: {
          name: "Filters",
          description: "The filter to apply to stack instances",
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
        StackInstanceAccount: {
          name: "Stack Instance Account",
          description:
            "The name of the Amazon Web Services account that you want to list stack instances for.",
          type: "string",
          required: false,
        },
        StackInstanceRegion: {
          name: "Stack Instance Region",
          description:
            "The name of the Region where you want to list stack instances.",
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

        const command = new ListStackInstancesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Stack Instances Result",
      description: "Result from ListStackInstances operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Summaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                StackSetId: {
                  type: "string",
                },
                Region: {
                  type: "string",
                },
                Account: {
                  type: "string",
                },
                StackId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusReason: {
                  type: "string",
                },
                StackInstanceStatus: {
                  type: "object",
                  properties: {
                    DetailedStatus: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                OrganizationalUnitId: {
                  type: "string",
                },
                DriftStatus: {
                  type: "string",
                },
                LastDriftCheckTimestamp: {
                  type: "string",
                },
                LastOperationId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of StackInstanceSummary structures that contain information about the specified stack instances.",
          },
          NextToken: {
            type: "string",
            description:
              "If the request doesn't return all the remaining results, NextToken is set to a token.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listStackInstances;
