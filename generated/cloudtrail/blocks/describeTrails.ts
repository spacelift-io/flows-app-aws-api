import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  DescribeTrailsCommand,
} from "@aws-sdk/client-cloudtrail";

const describeTrails: AppBlock = {
  name: "Describe Trails",
  description:
    "Retrieves settings for one or more trails associated with the current Region for your account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        trailNameList: {
          name: "trail Name List",
          description:
            "Specifies a list of trail names, trail ARNs, or both, of the trails to describe.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        includeShadowTrails: {
          name: "include Shadow Trails",
          description:
            "Specifies whether to include shadow trails in the response.",
          type: "boolean",
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

        const command = new DescribeTrailsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Trails Result",
      description: "Result from DescribeTrails operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          trailList: {
            type: "array",
            items: {
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
            },
            description: "The list of trail objects.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeTrails;
