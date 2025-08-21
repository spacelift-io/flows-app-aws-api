import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateStoreImageTaskCommand } from "@aws-sdk/client-ec2";

const createStoreImageTask: AppBlock = {
  name: "Create Store Image Task",
  description: "Stores an AMI as a single object in an Amazon S3 bucket.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ImageId: {
          name: "Image Id",
          description: "The ID of the AMI.",
          type: "string",
          required: true,
        },
        Bucket: {
          name: "Bucket",
          description:
            "The name of the Amazon S3 bucket in which the AMI object will be stored.",
          type: "string",
          required: true,
        },
        S3ObjectTags: {
          name: "S3Object Tags",
          description:
            "The tags to apply to the AMI object that will be stored in the Amazon S3 bucket.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              additionalProperties: false,
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

        const command = new CreateStoreImageTaskCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Store Image Task Result",
      description: "Result from CreateStoreImageTask operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ObjectKey: {
            type: "string",
            description: "The name of the stored AMI object in the S3 bucket.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createStoreImageTask;
