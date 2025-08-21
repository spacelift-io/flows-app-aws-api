import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetDeclarativePoliciesReportSummaryCommand,
} from "@aws-sdk/client-ec2";

const getDeclarativePoliciesReportSummary: AppBlock = {
  name: "Get Declarative Policies Report Summary",
  description: "Retrieves a summary of the account status report.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        ReportId: {
          name: "Report Id",
          description: "The ID of the report.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new GetDeclarativePoliciesReportSummaryCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Declarative Policies Report Summary Result",
      description: "Result from GetDeclarativePoliciesReportSummary operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReportId: {
            type: "string",
            description: "The ID of the report.",
          },
          S3Bucket: {
            type: "string",
            description:
              "The name of the Amazon S3 bucket where the report is located.",
          },
          S3Prefix: {
            type: "string",
            description: "The prefix for your S3 object.",
          },
          TargetId: {
            type: "string",
            description: "The root ID, organizational unit ID, or account ID.",
          },
          StartTime: {
            type: "string",
            description: "The time when the report generation started.",
          },
          EndTime: {
            type: "string",
            description: "The time when the report generation ended.",
          },
          NumberOfAccounts: {
            type: "number",
            description:
              "The total number of accounts associated with the specified targetId.",
          },
          NumberOfFailedAccounts: {
            type: "number",
            description:
              "The number of accounts where attributes could not be retrieved in any Region.",
          },
          AttributeSummaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AttributeName: {
                  type: "string",
                },
                MostFrequentValue: {
                  type: "string",
                },
                NumberOfMatchedAccounts: {
                  type: "number",
                },
                NumberOfUnmatchedAccounts: {
                  type: "number",
                },
                RegionalSummaries: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      RegionName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NumberOfMatchedAccounts: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NumberOfUnmatchedAccounts: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description: "The attributes described in the report.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getDeclarativePoliciesReportSummary;
