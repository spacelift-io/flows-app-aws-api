import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetMaintenanceWindowCommand } from "@aws-sdk/client-ssm";

const getMaintenanceWindow: AppBlock = {
  name: "Get Maintenance Window",
  description: "Retrieves a maintenance window.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        WindowId: {
          name: "Window Id",
          description:
            "The ID of the maintenance window for which you want to retrieve information.",
          type: "string",
          required: true,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetMaintenanceWindowCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Maintenance Window Result",
      description: "Result from GetMaintenanceWindow operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowId: {
            type: "string",
            description: "The ID of the created maintenance window.",
          },
          Name: {
            type: "string",
            description: "The name of the maintenance window.",
          },
          Description: {
            type: "string",
            description: "The description of the maintenance window.",
          },
          StartDate: {
            type: "string",
            description:
              "The date and time, in ISO-8601 Extended format, for when the maintenance window is scheduled to become active.",
          },
          EndDate: {
            type: "string",
            description:
              "The date and time, in ISO-8601 Extended format, for when the maintenance window is scheduled to become inactive.",
          },
          Schedule: {
            type: "string",
            description:
              "The schedule of the maintenance window in the form of a cron or rate expression.",
          },
          ScheduleTimezone: {
            type: "string",
            description:
              "The time zone that the scheduled maintenance window executions are based on, in Internet Assigned Numbers Authority (IANA) format.",
          },
          ScheduleOffset: {
            type: "number",
            description:
              "The number of days to wait to run a maintenance window after the scheduled cron expression date and time.",
          },
          NextExecutionTime: {
            type: "string",
            description:
              "The next time the maintenance window will actually run, taking into account any specified times for the maintenance window to become active or inactive.",
          },
          Duration: {
            type: "number",
            description: "The duration of the maintenance window in hours.",
          },
          Cutoff: {
            type: "number",
            description:
              "The number of hours before the end of the maintenance window that Amazon Web Services Systems Manager stops scheduling new tasks for execution.",
          },
          AllowUnassociatedTargets: {
            type: "boolean",
            description:
              "Whether targets must be registered with the maintenance window before tasks can be defined for those targets.",
          },
          Enabled: {
            type: "boolean",
            description: "Indicates whether the maintenance window is enabled.",
          },
          CreatedDate: {
            type: "string",
            description: "The date the maintenance window was created.",
          },
          ModifiedDate: {
            type: "string",
            description: "The date the maintenance window was last modified.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getMaintenanceWindow;
