import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, CreateOpsItemCommand } from "@aws-sdk/client-ssm";

const createOpsItem: AppBlock = {
  name: "Create Ops Item",
  description: "Creates a new OpsItem.",
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
          required: true,
        },
        OpsItemType: {
          name: "Ops Item Type",
          description: "The type of OpsItem to create.",
          type: "string",
          required: false,
        },
        OperationalData: {
          name: "Operational Data",
          description:
            "Operational data is custom data that provides useful reference details about the OpsItem.",
          type: {
            type: "object",
            additionalProperties: {
              type: "object",
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
        Source: {
          name: "Source",
          description:
            "The origin of the OpsItem, such as Amazon EC2 or Systems Manager.",
          type: "string",
          required: true,
        },
        Title: {
          name: "Title",
          description:
            "A short heading that describes the nature of the OpsItem and the impacted resource.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description: "Optional metadata that you assign to a resource.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key", "Value"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        Category: {
          name: "Category",
          description: "Specify a category to assign to an OpsItem.",
          type: "string",
          required: false,
        },
        Severity: {
          name: "Severity",
          description: "Specify a severity to assign to an OpsItem.",
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
        AccountId: {
          name: "Account Id",
          description:
            "The target Amazon Web Services account where you want to create an OpsItem.",
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

        const command = new CreateOpsItemCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Ops Item Result",
      description: "Result from CreateOpsItem operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OpsItemId: {
            type: "string",
            description: "The ID of the OpsItem.",
          },
          OpsItemArn: {
            type: "string",
            description: "The OpsItem Amazon Resource Name (ARN).",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createOpsItem;
