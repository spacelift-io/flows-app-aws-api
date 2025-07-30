import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeDeclarativePoliciesReportsCommand,
} from "@aws-sdk/client-ec2";

const describeDeclarativePoliciesReports: AppBlock = {
  name: "Describe Declarative Policies Reports",
  description:
    "Describes the metadata of an account status report, including the status of the report.",
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
        NextToken: {
          name: "Next Token",
          description: "The token returned from a previous paginated request.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
          type: "number",
          required: false,
        },
        ReportIds: {
          name: "Report Ids",
          description: "One or more report IDs.",
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

        const client = new EC2Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribeDeclarativePoliciesReportsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Declarative Policies Reports Result",
      description: "Result from DescribeDeclarativePoliciesReports operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
          Reports: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ReportId: {
                  type: "string",
                },
                S3Bucket: {
                  type: "string",
                },
                S3Prefix: {
                  type: "string",
                },
                TargetId: {
                  type: "string",
                },
                StartTime: {
                  type: "string",
                },
                EndTime: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
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
            description: "The report metadata.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDeclarativePoliciesReports;
