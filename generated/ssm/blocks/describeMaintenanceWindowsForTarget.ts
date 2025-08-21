import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeMaintenanceWindowsForTargetCommand,
} from "@aws-sdk/client-ssm";

const describeMaintenanceWindowsForTarget: AppBlock = {
  name: "Describe Maintenance Windows For Target",
  description:
    "Retrieves information about the maintenance window targets or tasks that a managed node is associated with.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Targets: {
          name: "Targets",
          description:
            "The managed node ID or key-value pair to retrieve information about.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: true,
        },
        ResourceType: {
          name: "Resource Type",
          description:
            "The type of resource you want to retrieve information about.",
          type: "string",
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
          type: "string",
          required: false,
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

        const command = new DescribeMaintenanceWindowsForTargetCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Maintenance Windows For Target Result",
      description: "Result from DescribeMaintenanceWindowsForTarget operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          WindowIdentities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                WindowId: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the maintenance window targets and tasks a managed node is associated with.",
          },
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeMaintenanceWindowsForTarget;
