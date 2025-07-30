import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  ListImportFailuresCommand,
} from "@aws-sdk/client-cloudtrail";

const listImportFailures: AppBlock = {
  name: "List Import Failures",
  description: "Returns a list of failures for the specified import.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ImportId: {
          name: "Import Id",
          description: "The ID of the import.",
          type: "string",
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of failures to display on a single page.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A token you can use to get the next page of import failures.",
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
        });

        const command = new ListImportFailuresCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Import Failures Result",
      description: "Result from ListImportFailures operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Failures: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Location: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                ErrorType: {
                  type: "string",
                },
                ErrorMessage: {
                  type: "string",
                },
                LastUpdatedTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Contains information about the import failures.",
          },
          NextToken: {
            type: "string",
            description: "A token you can use to get the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listImportFailures;
