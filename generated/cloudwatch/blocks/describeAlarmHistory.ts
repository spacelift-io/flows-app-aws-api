import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  DescribeAlarmHistoryCommand,
} from "@aws-sdk/client-cloudwatch";

const describeAlarmHistory: AppBlock = {
  name: "Describe Alarm History",
  description: "Retrieves the history for the specified alarm.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AlarmName: {
          name: "Alarm Name",
          description: "The name of the alarm.",
          type: "string",
          required: false,
        },
        AlarmTypes: {
          name: "Alarm Types",
          description:
            "Use this parameter to specify whether you want the operation to return metric alarms or composite alarms.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        HistoryItemType: {
          name: "History Item Type",
          description: "The type of alarm histories to retrieve.",
          type: "string",
          required: false,
        },
        StartDate: {
          name: "Start Date",
          description: "The starting date to retrieve alarm history.",
          type: "string",
          required: false,
        },
        EndDate: {
          name: "End Date",
          description: "The ending date to retrieve alarm history.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of alarm history records to retrieve.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "The token returned by a previous call to indicate that there is more data available.",
          type: "string",
          required: false,
        },
        ScanBy: {
          name: "Scan By",
          description:
            "Specified whether to return the newest or oldest alarm history first.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudWatchClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribeAlarmHistoryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Alarm History Result",
      description: "Result from DescribeAlarmHistory operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AlarmHistoryItems: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AlarmName: {
                  type: "string",
                },
                AlarmType: {
                  type: "string",
                },
                Timestamp: {
                  type: "string",
                },
                HistoryItemType: {
                  type: "string",
                },
                HistorySummary: {
                  type: "string",
                },
                HistoryData: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The alarm histories, in JSON format.",
          },
          NextToken: {
            type: "string",
            description:
              "The token that marks the start of the next batch of returned results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAlarmHistory;
