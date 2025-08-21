import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  CreatePlatformApplicationCommand,
} from "@aws-sdk/client-sns";

const createPlatformApplication: AppBlock = {
  name: "Create Platform Application",
  description:
    "Creates a platform application object for one of the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging), to which devices and mobile apps may register.",
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
            "Application names must be made up of only uppercase and lowercase ASCII letters, numbers, underscores, hyphens, and periods, and must be between 1 and 256 characters long.",
          type: "string",
          required: true,
        },
        Platform: {
          name: "Platform",
          description:
            "The following platforms are supported: ADM (Amazon Device Messaging), APNS (Apple Push Notification Service), APNS_SANDBOX, and GCM (Firebase Cloud Messaging).",
          type: "string",
          required: true,
        },
        Attributes: {
          name: "Attributes",
          description:
            "For a list of attributes, see SetPlatformApplicationAttributes .",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SNSClient({
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

        const command = new CreatePlatformApplicationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Platform Application Result",
      description: "Result from CreatePlatformApplication operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PlatformApplicationArn: {
            type: "string",
            description: "PlatformApplicationArn is returned.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createPlatformApplication;
