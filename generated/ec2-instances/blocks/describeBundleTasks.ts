import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeBundleTasksCommand } from "@aws-sdk/client-ec2";

const describeBundleTasks: AppBlock = {
  name: "Describe Bundle Tasks",
  description:
    "Describes the specified bundle tasks or all of your bundle tasks.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        BundleIds: {
          name: "Bundle Ids",
          description: "The bundle task IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "The filters.",
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

        const command = new DescribeBundleTasksCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Bundle Tasks Result",
      description: "Result from DescribeBundleTasks operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BundleTasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InstanceId: {
                  type: "string",
                },
                BundleId: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                StartTime: {
                  type: "string",
                },
                UpdateTime: {
                  type: "string",
                },
                Storage: {
                  type: "object",
                  properties: {
                    S3: {
                      type: "object",
                      properties: {
                        AWSAccessKeyId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Bucket: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Prefix: {
                          type: "object",
                          additionalProperties: true,
                        },
                        UploadPolicy: {
                          type: "object",
                          additionalProperties: true,
                        },
                        UploadPolicySignature: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                Progress: {
                  type: "string",
                },
                BundleTaskError: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "string",
                    },
                    Message: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "Information about the bundle tasks.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeBundleTasks;
