import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RDSClient,
  DescribePendingMaintenanceActionsCommand,
} from "@aws-sdk/client-rds";

const describePendingMaintenanceActions: AppBlock = {
  name: "Describe Pending Maintenance Actions",
  description:
    "Returns a list of resources (for example, DB instances) that have at least one pending maintenance action.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceIdentifier: {
          name: "Resource Identifier",
          description:
            "The ARN of a resource to return pending maintenance actions for.",
          type: "string",
          required: false,
        },
        Filters: {
          name: "Filters",
          description:
            "A filter that specifies one or more resources to return pending maintenance actions for.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["Name", "Values"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "An optional pagination token provided by a previous DescribePendingMaintenanceActions request.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of records to include in the response.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RDSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribePendingMaintenanceActionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Pending Maintenance Actions Result",
      description: "Result from DescribePendingMaintenanceActions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PendingMaintenanceActions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceIdentifier: {
                  type: "string",
                },
                PendingMaintenanceActionDetails: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Action: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AutoAppliedAfterDate: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ForcedApplyDate: {
                        type: "object",
                        additionalProperties: true,
                      },
                      OptInStatus: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CurrentApplyDate: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Description: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of the pending maintenance actions for the resource.",
          },
          Marker: {
            type: "string",
            description:
              "An optional pagination token provided by a previous DescribePendingMaintenanceActions request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describePendingMaintenanceActions;
