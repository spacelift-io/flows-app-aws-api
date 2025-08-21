import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, BundleInstanceCommand } from "@aws-sdk/client-ec2";

const bundleInstance: AppBlock = {
  name: "Bundle Instance",
  description: "Bundles an Amazon instance store-backed Windows instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the instance to bundle.",
          type: "string",
          required: true,
        },
        Storage: {
          name: "Storage",
          description: "The bucket in which to store the AMI.",
          type: {
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

        const command = new BundleInstanceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Bundle Instance Result",
      description: "Result from BundleInstance operation",
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

export default bundleInstance;
