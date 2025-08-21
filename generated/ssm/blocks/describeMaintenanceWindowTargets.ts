import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeMaintenanceWindowTargetsCommand,
} from "@aws-sdk/client-ssm";

const describeMaintenanceWindowTargets: AppBlock = {
  name: "Describe Maintenance Window Targets",
  description: "Lists the targets registered with the maintenance window.",
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
            "The ID of the maintenance window whose targets should be retrieved.",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description:
            "Optional filters that can be used to narrow down the scope of the returned window targets.",
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
          required: false,
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

        const command = new DescribeMaintenanceWindowTargetsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Maintenance Window Targets Result",
      description: "Result from DescribeMaintenanceWindowTargets operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Targets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                WindowId: {
                  type: "string",
                },
                WindowTargetId: {
                  type: "string",
                },
                ResourceType: {
                  type: "string",
                },
                Targets: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Values: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                OwnerInformation: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the targets in the maintenance window.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use when requesting the next set of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeMaintenanceWindowTargets;
