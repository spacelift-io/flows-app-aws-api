import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DescribeSessionsCommand } from "@aws-sdk/client-ssm";

const describeSessions: AppBlock = {
  name: "Describe Sessions",
  description:
    "Retrieves a list of all active sessions (both connected and disconnected) or terminated sessions from the past 30 days.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        State: {
          name: "State",
          description: "The session status to retrieve a list of sessions for.",
          type: "string",
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "One or more filters to limit the type of sessions returned by the request.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                },
                value: {
                  type: "string",
                },
              },
              required: ["key", "value"],
              additionalProperties: false,
            },
          },
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

        const command = new DescribeSessionsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Sessions Result",
      description: "Result from DescribeSessions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Sessions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SessionId: {
                  type: "string",
                },
                Target: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StartDate: {
                  type: "string",
                },
                EndDate: {
                  type: "string",
                },
                DocumentName: {
                  type: "string",
                },
                Owner: {
                  type: "string",
                },
                Reason: {
                  type: "string",
                },
                Details: {
                  type: "string",
                },
                OutputUrl: {
                  type: "object",
                  properties: {
                    S3OutputUrl: {
                      type: "string",
                    },
                    CloudWatchOutputUrl: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                MaxSessionDuration: {
                  type: "string",
                },
                AccessType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of sessions meeting the request parameters.",
          },
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeSessions;
