import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeFastLaunchImagesCommand,
} from "@aws-sdk/client-ec2";

const describeFastLaunchImages: AppBlock = {
  name: "Describe Fast Launch Images",
  description:
    "Describe details for Windows AMIs that are configured for Windows fast launch.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ImageIds: {
          name: "Image Ids",
          description:
            "Specify one or more Windows AMI image IDs for the request.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "Use the following filters to streamline results.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token returned from a previous paginated request.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new DescribeFastLaunchImagesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Fast Launch Images Result",
      description: "Result from DescribeFastLaunchImages operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FastLaunchImages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ImageId: {
                  type: "string",
                },
                ResourceType: {
                  type: "string",
                },
                SnapshotConfiguration: {
                  type: "object",
                  properties: {
                    TargetResourceCount: {
                      type: "number",
                    },
                  },
                  additionalProperties: false,
                },
                LaunchTemplate: {
                  type: "object",
                  properties: {
                    LaunchTemplateId: {
                      type: "string",
                    },
                    LaunchTemplateName: {
                      type: "string",
                    },
                    Version: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                MaxParallelLaunches: {
                  type: "number",
                },
                OwnerId: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                StateTransitionReason: {
                  type: "string",
                },
                StateTransitionTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A collection of details about the fast-launch enabled Windows images that meet the requested criteria.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeFastLaunchImages;
