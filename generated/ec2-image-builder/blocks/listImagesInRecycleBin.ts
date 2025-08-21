import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ListImagesInRecycleBinCommand } from "@aws-sdk/client-ec2";

const listImagesInRecycleBin: AppBlock = {
  name: "List Images In Recycle Bin",
  description: "Lists one or more AMIs that are currently in the Recycle Bin.",
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
          description: "The IDs of the AMIs to list.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token returned from a previous paginated request.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
          type: "number",
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

        const command = new ListImagesInRecycleBinCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Images In Recycle Bin Result",
      description: "Result from ListImagesInRecycleBin operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Images: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ImageId: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                RecycleBinEnterTime: {
                  type: "string",
                },
                RecycleBinExitTime: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the AMIs.",
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

export default listImagesInRecycleBin;
