import { AppBlock, events } from "@slflows/sdk/v1";
import { CloudTrailClient, GetImportCommand } from "@aws-sdk/client-cloudtrail";

const getImport: AppBlock = {
  name: "Get Import",
  description: "Returns information about a specific import.",
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
          description: "The ID for the import.",
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
        });

        const command = new GetImportCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Import Result",
      description: "Result from GetImport operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ImportId: {
            type: "string",
            description: "The ID of the import.",
          },
          Destinations: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The ARN of the destination event data store.",
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
            description: "The source S3 bucket.",
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
            description: "The timestamp of when the import was updated.",
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
            description: "Provides statistics for the import.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getImport;
