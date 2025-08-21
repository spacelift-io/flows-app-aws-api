import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetOpsItemCommand } from "@aws-sdk/client-ssm";

const getOpsItem: AppBlock = {
  name: "Get Ops Item",
  description: "Get information about an OpsItem by using the ID.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OpsItemId: {
          name: "Ops Item Id",
          description: "The ID of the OpsItem that you want to get.",
          type: "string",
          required: true,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetOpsItemCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Ops Item Result",
      description: "Result from GetOpsItem operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OpsItem: {
            type: "object",
            properties: {
              CreatedBy: {
                type: "string",
              },
              OpsItemType: {
                type: "string",
              },
              CreatedTime: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              LastModifiedBy: {
                type: "string",
              },
              LastModifiedTime: {
                type: "string",
              },
              Notifications: {
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
              Priority: {
                type: "number",
              },
              RelatedOpsItems: {
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
              Status: {
                type: "string",
              },
              OpsItemId: {
                type: "string",
              },
              Version: {
                type: "string",
              },
              Title: {
                type: "string",
              },
              Source: {
                type: "string",
              },
              OperationalData: {
                type: "object",
                additionalProperties: {
                  type: "object",
                },
              },
              Category: {
                type: "string",
              },
              Severity: {
                type: "string",
              },
              ActualStartTime: {
                type: "string",
              },
              ActualEndTime: {
                type: "string",
              },
              PlannedStartTime: {
                type: "string",
              },
              PlannedEndTime: {
                type: "string",
              },
              OpsItemArn: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The OpsItem.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getOpsItem;
