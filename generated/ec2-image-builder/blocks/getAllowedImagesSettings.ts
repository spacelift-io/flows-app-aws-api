import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetAllowedImagesSettingsCommand,
} from "@aws-sdk/client-ec2";

const getAllowedImagesSettings: AppBlock = {
  name: "Get Allowed Images Settings",
  description:
    "Gets the current state of the Allowed AMIs setting and the list of Allowed AMIs criteria at the account level in the specified Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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

        const command = new GetAllowedImagesSettingsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Allowed Images Settings Result",
      description: "Result from GetAllowedImagesSettings operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          State: {
            type: "string",
            description:
              "The current state of the Allowed AMIs setting at the account level in the specified Amazon Web Services Region.",
          },
          ImageCriteria: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ImageProviders: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "The list of criteria for images that are discoverable and usable in the account in the specified Amazon Web Services Region.",
          },
          ManagedBy: {
            type: "string",
            description: "The entity that manages the Allowed AMIs settings.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getAllowedImagesSettings;
