import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  ListResourceComplianceSummariesCommand,
} from "@aws-sdk/client-ssm";

const listResourceComplianceSummaries: AppBlock = {
  name: "List Resource Compliance Summaries",
  description: "Returns a resource-level summary count.",
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
          description: "One or more filters.",
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
                Type: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "A token to start the list.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
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
        });

        const command = new ListResourceComplianceSummariesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Resource Compliance Summaries Result",
      description: "Result from ListResourceComplianceSummaries operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ResourceComplianceSummaryItems: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ComplianceType: {
                  type: "string",
                },
                ResourceType: {
                  type: "string",
                },
                ResourceId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                OverallSeverity: {
                  type: "string",
                },
                ExecutionSummary: {
                  type: "object",
                  properties: {
                    ExecutionTime: {
                      type: "string",
                    },
                    ExecutionId: {
                      type: "string",
                    },
                    ExecutionType: {
                      type: "string",
                    },
                  },
                  required: ["ExecutionTime"],
                  additionalProperties: false,
                },
                CompliantSummary: {
                  type: "object",
                  properties: {
                    CompliantCount: {
                      type: "number",
                    },
                    SeveritySummary: {
                      type: "object",
                      properties: {
                        CriticalCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                        HighCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                        MediumCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                        LowCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                        InformationalCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                        UnspecifiedCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                NonCompliantSummary: {
                  type: "object",
                  properties: {
                    NonCompliantCount: {
                      type: "number",
                    },
                    SeveritySummary: {
                      type: "object",
                      properties: {
                        CriticalCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                        HighCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                        MediumCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                        LowCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                        InformationalCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                        UnspecifiedCount: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description:
              "A summary count for specified or targeted managed nodes.",
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

export default listResourceComplianceSummaries;
