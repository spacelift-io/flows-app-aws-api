import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, UpdateOpsItemCommand } from "@aws-sdk/client-ssm";

const updateOpsItem: AppBlock = {
  name: "Update Ops Item",
  description: "Edit or change an OpsItem.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description:
            "User-defined text that contains information about the OpsItem, in Markdown format.",
          type: "string",
          required: false,
        },
        OperationalData: {
          name: "Operational Data",
          description:
            "Add new keys or edit existing key-value pairs of the OperationalData map in the OpsItem object.",
          type: {
            type: "object",
            additionalProperties: {
              type: "object",
            },
          },
          required: false,
        },
        OperationalDataToDelete: {
          name: "Operational Data To Delete",
          description:
            "Keys that you want to remove from the OperationalData map.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Notifications: {
          name: "Notifications",
          description:
            "The Amazon Resource Name (ARN) of an SNS topic where notifications are sent when this OpsItem is edited or changed.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Arn: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        Priority: {
          name: "Priority",
          description:
            "The importance of this OpsItem in relation to other OpsItems in the system.",
          type: "number",
          required: false,
        },
        RelatedOpsItems: {
          name: "Related Ops Items",
          description:
            "One or more OpsItems that share something in common with the current OpsItems.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                OpsItemId: {
                  type: "string",
                },
              },
              required: ["OpsItemId"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        Status: {
          name: "Status",
          description: "The OpsItem status.",
          type: "string",
          required: false,
        },
        OpsItemId: {
          name: "Ops Item Id",
          description: "The ID of the OpsItem.",
          type: "string",
          required: true,
        },
        Title: {
          name: "Title",
          description:
            "A short heading that describes the nature of the OpsItem and the impacted resource.",
          type: "string",
          required: false,
        },
        Category: {
          name: "Category",
          description: "Specify a new category for an OpsItem.",
          type: "string",
          required: false,
        },
        Severity: {
          name: "Severity",
          description: "Specify a new severity for an OpsItem.",
          type: "string",
          required: false,
        },
        ActualStartTime: {
          name: "Actual Start Time",
          description: "The time a runbook workflow started.",
          type: "string",
          required: false,
        },
        ActualEndTime: {
          name: "Actual End Time",
          description: "The time a runbook workflow ended.",
          type: "string",
          required: false,
        },
        PlannedStartTime: {
          name: "Planned Start Time",
          description:
            "The time specified in a change request for a runbook workflow to start.",
          type: "string",
          required: false,
        },
        PlannedEndTime: {
          name: "Planned End Time",
          description:
            "The time specified in a change request for a runbook workflow to end.",
          type: "string",
          required: false,
        },
        OpsItemArn: {
          name: "Ops Item Arn",
          description: "The OpsItem Amazon Resource Name (ARN).",
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
        });

        const command = new UpdateOpsItemCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Ops Item Result",
      description: "Result from UpdateOpsItem operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default updateOpsItem;
