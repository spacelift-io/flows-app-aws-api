import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  StartImportCommand,
} from "@aws-sdk/client-cloudtrail";

const startImport: AppBlock = {
  name: "Start Import",
  description:
    "Starts an import of logged trail events from a source S3 bucket to a destination event data store.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Destinations: {
          name: "Destinations",
          description: "The ARN of the destination event data store.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        ImportSource: {
          name: "Import Source",
          description: "The source S3 bucket for the import.",
          type: {
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
          },
          required: false,
        },
        StartEventTime: {
          name: "Start Event Time",
          description:
            "Use with EndEventTime to bound a StartImport request, and limit imported trail events to only those events logged within a specified time period.",
          type: "string",
          required: false,
        },
        EndEventTime: {
          name: "End Event Time",
          description:
            "Use with StartEventTime to bound a StartImport request, and limit imported trail events to only those events logged within a specified time period.",
          type: "string",
          required: false,
        },
        ImportId: {
          name: "Import Id",
          description: "The ID of the import.",
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

        const command = new StartImportCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Start Import Result",
      description: "Result from StartImport operation",
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
            description: "The source S3 bucket for the import.",
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
            description:
              "Shows the status of the import after a StartImport request.",
          },
          CreatedTimestamp: {
            type: "string",
            description: "The timestamp for the import's creation.",
          },
          UpdatedTimestamp: {
            type: "string",
            description:
              "The timestamp of the import's last update, if applicable.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default startImport;
