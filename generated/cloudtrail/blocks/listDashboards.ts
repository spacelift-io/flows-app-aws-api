import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  ListDashboardsCommand,
} from "@aws-sdk/client-cloudtrail";

const listDashboards: AppBlock = {
  name: "List Dashboards",
  description:
    "Returns information about all dashboards in the account, in the current Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NamePrefix: {
          name: "Name Prefix",
          description: "Specify a name prefix to filter on.",
          type: "string",
          required: false,
        },
        Type: {
          name: "Type",
          description:
            "Specify a dashboard type to filter on: CUSTOM or MANAGED.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A token you can use to get the next page of dashboard results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of dashboards to display on a single page.",
          type: "number",
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
          Dashboards: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DashboardArn: {
                  type: "string",
                },
                Type: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Contains information about dashboards in the account, in the current Region that match the applied filters.",
          },
          NextToken: {
            type: "string",
            description:
              "A token you can use to get the next page of dashboard results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listDashboards;
