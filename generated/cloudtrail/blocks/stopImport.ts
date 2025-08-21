import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  StopImportCommand,
} from "@aws-sdk/client-cloudtrail";

const stopImport: AppBlock = {
  name: "Stop Import",
  description: "Stops a specified import.",
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

        const command = new StopImportCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Stop Import Result",
      description: "Result from StopImport operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ImportId: {
            type: "string",
            description: "The ID for the import.",
          },
          ImportSource: {
            type: "object",
            properties: {
              S3: {
                type: "object",
                properties: {
                  S3LocationUri: {
                    type: "string",
                  },
                  S3BucketRegion: {
                    type: "string",
                  },
                  S3BucketAccessRoleArn: {
                    type: "string",
                  },
                },
                required: [
                  "S3LocationUri",
                  "S3BucketRegion",
                  "S3BucketAccessRoleArn",
                ],
                additionalProperties: false,
              },
            },
            required: ["S3"],
            additionalProperties: false,
            description: "The source S3 bucket for the import.",
          },
          Destinations: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The ARN of the destination event data store.",
          },
          ImportStatus: {
            type: "string",
            description: "The status of the import.",
          },
          CreatedTimestamp: {
            type: "string",
            description: "The timestamp of the import's creation.",
          },
          UpdatedTimestamp: {
            type: "string",
            description: "The timestamp of the import's last update.",
          },
          StartEventTime: {
            type: "string",
            description:
              "Used with EndEventTime to bound a StartImport request, and limit imported trail events to only those events logged within a specified time period.",
          },
          EndEventTime: {
            type: "string",
            description:
              "Used with StartEventTime to bound a StartImport request, and limit imported trail events to only those events logged within a specified time period.",
          },
          ImportStatistics: {
            type: "object",
            properties: {
              PrefixesFound: {
                type: "number",
              },
              PrefixesCompleted: {
                type: "number",
              },
              FilesCompleted: {
                type: "number",
              },
              EventsCompleted: {
                type: "number",
              },
              FailedEntries: {
                type: "number",
              },
            },
            additionalProperties: false,
            description: "Returns information on the stopped import.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default stopImport;
