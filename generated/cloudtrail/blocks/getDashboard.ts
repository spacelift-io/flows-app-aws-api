import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  GetDashboardCommand,
} from "@aws-sdk/client-cloudtrail";

const getDashboard: AppBlock = {
  name: "Get Dashboard",
  description: "Returns the specified dashboard.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DashboardId: {
          name: "Dashboard Id",
          description: "The name or ARN for the dashboard.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudTrailClient({
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

        const command = new GetDashboardCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Dashboard Result",
      description: "Result from GetDashboard operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DashboardArn: {
            type: "string",
            description: "The ARN for the dashboard.",
          },
          Type: {
            type: "string",
            description: "The type of dashboard.",
          },
          Status: {
            type: "string",
            description: "The status of the dashboard.",
          },
          Widgets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                QueryAlias: {
                  type: "string",
                },
                QueryStatement: {
                  type: "string",
                },
                QueryParameters: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                ViewProperties: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description: "An array of widgets for the dashboard.",
          },
          RefreshSchedule: {
            type: "object",
            properties: {
              Frequency: {
                type: "object",
                properties: {
                  Unit: {
                    type: "string",
                  },
                  Value: {
                    type: "number",
                  },
                },
                additionalProperties: false,
              },
              Status: {
                type: "string",
              },
              TimeOfDay: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The refresh schedule for the dashboard, if configured.",
          },
          CreatedTimestamp: {
            type: "string",
            description:
              "The timestamp that shows when the dashboard was created.",
          },
          UpdatedTimestamp: {
            type: "string",
            description:
              "The timestamp that shows when the dashboard was last updated.",
          },
          LastRefreshId: {
            type: "string",
            description: "The ID of the last dashboard refresh.",
          },
          LastRefreshFailureReason: {
            type: "string",
            description:
              "Provides information about failures for the last scheduled refresh.",
          },
          TerminationProtectionEnabled: {
            type: "boolean",
            description:
              "Indicates whether termination protection is enabled for the dashboard.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getDashboard;
