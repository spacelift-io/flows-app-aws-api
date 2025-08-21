import { AppBlock, events } from "@slflows/sdk/v1";
import { CloudTrailClient, GetTrailCommand } from "@aws-sdk/client-cloudtrail";

const getTrail: AppBlock = {
  name: "Get Trail",
  description: "Returns settings information for a specified trail.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description:
            "The name or the Amazon Resource Name (ARN) of the trail for which you want to retrieve settings information.",
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

        const command = new GetTrailCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Trail Result",
      description: "Result from GetTrail operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Trail: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
              S3BucketName: {
                type: "string",
              },
              S3KeyPrefix: {
                type: "string",
              },
              SnsTopicName: {
                type: "string",
              },
              SnsTopicARN: {
                type: "string",
              },
              IncludeGlobalServiceEvents: {
                type: "boolean",
              },
              IsMultiRegionTrail: {
                type: "boolean",
              },
              HomeRegion: {
                type: "string",
              },
              TrailARN: {
                type: "string",
              },
              LogFileValidationEnabled: {
                type: "boolean",
              },
              CloudWatchLogsLogGroupArn: {
                type: "string",
              },
              CloudWatchLogsRoleArn: {
                type: "string",
              },
              KmsKeyId: {
                type: "string",
              },
              HasCustomEventSelectors: {
                type: "boolean",
              },
              HasInsightSelectors: {
                type: "boolean",
              },
              IsOrganizationTrail: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description: "The settings for a trail.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getTrail;
