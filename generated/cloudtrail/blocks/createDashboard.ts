import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  CreateDashboardCommand,
} from "@aws-sdk/client-cloudtrail";

const createDashboard: AppBlock = {
  name: "Create Dashboard",
  description: "Creates a custom dashboard or the Highlights dashboard.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name of the dashboard.",
          type: "string",
          required: true,
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
        TagsList: {
          name: "Tags List",
          description: "A list of tags.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key"],
              additionalProperties: false,
            },
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
        Widgets: {
          name: "Widgets",
          description: "An array of widgets for a custom dashboard.",
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
        });

        const command = new CreateDashboardCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Dashboard Result",
      description: "Result from CreateDashboard operation",
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
            description: "The name of the dashboard.",
          },
          Type: {
            type: "string",
            description: "The dashboard type.",
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
          TagsList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key"],
              additionalProperties: false,
            },
            description: "A list of tags.",
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
        },
        additionalProperties: true,
      },
    },
  },
};

export default createDashboard;
