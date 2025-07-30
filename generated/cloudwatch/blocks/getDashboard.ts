import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  GetDashboardCommand,
} from "@aws-sdk/client-cloudwatch";

const getDashboard: AppBlock = {
  name: "Get Dashboard",
  description: "Displays the details of the dashboard that you specify.",
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
          description: "The name of the dashboard to be described.",
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
            description: "The Amazon Resource Name (ARN) of the dashboard.",
          },
          DashboardBody: {
            type: "string",
            description:
              "The detailed information about the dashboard, including what widgets are included and their location on the dashboard.",
          },
          DashboardName: {
            type: "string",
            description: "The name of the dashboard.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getDashboard;
