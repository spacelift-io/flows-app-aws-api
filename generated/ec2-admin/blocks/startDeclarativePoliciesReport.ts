import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  StartDeclarativePoliciesReportCommand,
} from "@aws-sdk/client-ec2";

const startDeclarativePoliciesReport: AppBlock = {
  name: "Start Declarative Policies Report",
  description: "Generates an account status report.",
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
        S3Bucket: {
          name: "S3Bucket",
          description:
            "The name of the S3 bucket where the report will be saved.",
          type: "string",
          required: true,
        },
        S3Prefix: {
          name: "S3Prefix",
          description: "The prefix for your S3 object.",
          type: "string",
          required: false,
        },
        TargetId: {
          name: "Target Id",
          description: "The root ID, organizational unit ID, or account ID.",
          type: "string",
          required: true,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to apply.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
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

        const command = new StartDeclarativePoliciesReportCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Start Declarative Policies Report Result",
      description: "Result from StartDeclarativePoliciesReport operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ReportId: {
            type: "string",
            description: "The ID of the report.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default startDeclarativePoliciesReport;
