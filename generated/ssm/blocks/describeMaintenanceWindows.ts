import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeMaintenanceWindowsCommand,
} from "@aws-sdk/client-ssm";

const describeMaintenanceWindows: AppBlock = {
  name: "Describe Maintenance Windows",
  description:
    "Retrieves the maintenance windows in an Amazon Web Services account.",
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
          description:
            "Optional filters used to narrow down the scope of the returned maintenance windows.",
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
              },
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
          description: "The token for the next set of items to return.",
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
        });

        const command = new DescribeMaintenanceWindowsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Maintenance Windows Result",
      description: "Result from DescribeMaintenanceWindows operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowIdentities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                WindowId: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                Enabled: {
                  type: "boolean",
                },
                Duration: {
                  type: "number",
                },
                Cutoff: {
                  type: "number",
                },
                Schedule: {
                  type: "string",
                },
                ScheduleTimezone: {
                  type: "string",
                },
                ScheduleOffset: {
                  type: "number",
                },
                EndDate: {
                  type: "string",
                },
                StartDate: {
                  type: "string",
                },
                NextExecutionTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the maintenance windows.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use when requesting the next set of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeMaintenanceWindows;
