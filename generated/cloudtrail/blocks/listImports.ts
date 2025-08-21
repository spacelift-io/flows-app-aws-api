import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  ListImportsCommand,
} from "@aws-sdk/client-cloudtrail";

const listImports: AppBlock = {
  name: "List Imports",
  description:
    "Returns information on all imports, or a select set of imports by ImportStatus or Destination.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of imports to display on a single page.",
          type: "number",
          required: false,
        },
        Destination: {
          name: "Destination",
          description: "The ARN of the destination event data store.",
          type: "string",
          required: false,
        },
        ImportStatus: {
          name: "Import Status",
          description: "The status of the import.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A token you can use to get the next page of import results.",
          type: "string",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListImportsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Imports Result",
      description: "Result from ListImports operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Imports: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ImportId: {
                  type: "string",
                },
                ImportStatus: {
                  type: "string",
                },
                Destinations: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                CreatedTimestamp: {
                  type: "string",
                },
                UpdatedTimestamp: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The list of returned imports.",
          },
          NextToken: {
            type: "string",
            description:
              "A token you can use to get the next page of import results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listImports;
