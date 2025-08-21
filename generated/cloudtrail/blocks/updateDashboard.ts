import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  UpdateDashboardCommand,
} from "@aws-sdk/client-cloudtrail";

const updateDashboard: AppBlock = {
  name: "Update Dashboard",
  description: "Updates the specified dashboard.",
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
          description: "The name or ARN of the dashboard.",
          type: "string",
          required: true,
        },
        Widgets: {
          name: "Widgets",
          description: "An array of widgets for the dashboard.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
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
              required: ["QueryStatement", "ViewProperties"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        RefreshSchedule: {
          name: "Refresh Schedule",
          description: "The refresh schedule configuration for the dashboard.",
          type: {
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
          },
          required: false,
        },
        TerminationProtectionEnabled: {
          name: "Termination Protection Enabled",
          description:
            "Specifies whether termination protection is enabled for the dashboard.",
          type: "boolean",
          required: false,
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

        const command = new UpdateDashboardCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Dashboard Result",
      description: "Result from UpdateDashboard operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DashboardArn: {
            type: "string",
            description: "The ARN for the dashboard.",
          },
          Name: {
            type: "string",
            description: "The name for the dashboard.",
          },
          Type: {
            type: "string",
            description: "The type of dashboard.",
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
          TerminationProtectionEnabled: {
            type: "boolean",
            description:
              "Indicates whether termination protection is enabled for the dashboard.",
          },
          CreatedTimestamp: {
            type: "string",
            description:
              "The timestamp that shows when the dashboard was created.",
          },
          UpdatedTimestamp: {
            type: "string",
            description:
              "The timestamp that shows when the dashboard was updated.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateDashboard;
