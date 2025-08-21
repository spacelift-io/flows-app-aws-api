import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  PutDashboardCommand,
} from "@aws-sdk/client-cloudwatch";

const putDashboard: AppBlock = {
  name: "Put Dashboard",
  description:
    "Creates a dashboard if it does not already exist, or updates an existing dashboard.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DashboardName: {
          name: "Dashboard Name",
          description: "The name of the dashboard.",
          type: "string",
          required: true,
        },
        DashboardBody: {
          name: "Dashboard Body",
          description:
            "The detailed information about the dashboard in JSON format, including the widgets to include and their location on the dashboard.",
          type: "string",
          required: true,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new PutDashboardCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Dashboard Result",
      description: "Result from PutDashboard operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DashboardValidationMessages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DataPath: {
                  type: "string",
                },
                Message: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "If the input for PutDashboard was correct and the dashboard was successfully created or modified, this result is empty.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putDashboard;
