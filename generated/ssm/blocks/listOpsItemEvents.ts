import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, ListOpsItemEventsCommand } from "@aws-sdk/client-ssm";

const listOpsItemEvents: AppBlock = {
  name: "List Ops Item Events",
  description:
    "Returns a list of all OpsItem events in the current Amazon Web Services Region and Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description: "One or more OpsItem filters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                Operator: {
                  type: "string",
                },
              },
              required: ["Key", "Values", "Operator"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "A token to start the list.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
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

        const command = new ListOpsItemEventsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Ops Item Events Result",
      description: "Result from ListOpsItemEvents operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
          Summaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                OpsItemId: {
                  type: "string",
                },
                EventId: {
                  type: "string",
                },
                Source: {
                  type: "string",
                },
                DetailType: {
                  type: "string",
                },
                Detail: {
                  type: "string",
                },
                CreatedBy: {
                  type: "object",
                  properties: {
                    Arn: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                CreatedTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of event information for the specified OpsItems.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listOpsItemEvents;
