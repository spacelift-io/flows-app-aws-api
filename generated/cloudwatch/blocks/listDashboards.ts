import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudWatchClient,
  ListDashboardsCommand,
} from "@aws-sdk/client-cloudwatch";

const listDashboards: AppBlock = {
  name: "List Dashboards",
  description: "Returns a list of the dashboards for your account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DashboardNamePrefix: {
          name: "Dashboard Name Prefix",
          description:
            "If you specify this parameter, only the dashboards with names starting with the specified string are listed.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "The token returned by a previous call to indicate that there is more data available.",
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

        const command = new ListDashboardsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Dashboards Result",
      description: "Result from ListDashboards operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DashboardEntries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DashboardName: {
                  type: "string",
                },
                DashboardArn: {
                  type: "string",
                },
                LastModified: {
                  type: "string",
                },
                Size: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description: "The list of matching dashboards.",
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

export default listDashboards;
