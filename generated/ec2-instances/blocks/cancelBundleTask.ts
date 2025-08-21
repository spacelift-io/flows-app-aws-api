import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CancelBundleTaskCommand } from "@aws-sdk/client-ec2";

const cancelBundleTask: AppBlock = {
  name: "Cancel Bundle Task",
  description:
    "Cancels a bundling operation for an instance store-backed Windows instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        BundleId: {
          name: "Bundle Id",
          description: "The ID of the bundle task.",
          type: "string",
          required: true,
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

        const command = new CancelBundleTaskCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Cancel Bundle Task Result",
      description: "Result from CancelBundleTask operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          BundleTask: {
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
                        type: "string",
                      },
                      Bucket: {
                        type: "string",
                      },
                      Prefix: {
                        type: "string",
                      },
                      UploadPolicy: {
                        type: "string",
                      },
                      UploadPolicySignature: {
                        type: "string",
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
            description: "Information about the bundle task.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default cancelBundleTask;
