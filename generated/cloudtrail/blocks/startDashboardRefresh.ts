import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  StartDashboardRefreshCommand,
} from "@aws-sdk/client-cloudtrail";

const startDashboardRefresh: AppBlock = {
  name: "Start Dashboard Refresh",
  description: "Starts a refresh of the specified dashboard.",
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
        QueryParameterValues: {
          name: "Query Parameter Values",
          description:
            "The query parameter values for the dashboard For custom dashboards, the following query parameters are valid: $StartTime$, $EndTime$, and $Period$.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new StartDashboardRefreshCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Start Dashboard Refresh Result",
      description: "Result from StartDashboardRefresh operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RefreshId: {
            type: "string",
            description: "The refresh ID for the dashboard.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default startDashboardRefresh;
