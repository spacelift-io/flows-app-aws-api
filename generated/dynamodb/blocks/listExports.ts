import { AppBlock, events } from "@slflows/sdk/v1";
import { DynamoDBClient, ListExportsCommand } from "@aws-sdk/client-dynamodb";

const listExports: AppBlock = {
  name: "List Exports",
  description: "Lists completed exports within the past 90 days.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TableArn: {
          name: "Table Arn",
          description:
            "The Amazon Resource Name (ARN) associated with the exported table.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "Maximum number of results to return per page.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "An optional string that, if supplied, must be copied from the output of a previous call to ListExports.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new DynamoDBClient({
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

        const command = new ListExportsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Exports Result",
      description: "Result from ListExports operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ExportSummaries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ExportArn: {
                  type: "string",
                },
                ExportStatus: {
                  type: "string",
                },
                ExportType: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of ExportSummary objects.",
          },
          NextToken: {
            type: "string",
            description:
              "If this value is returned, there are additional results to be displayed.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listExports;
