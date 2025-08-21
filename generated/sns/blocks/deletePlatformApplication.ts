import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  DeletePlatformApplicationCommand,
} from "@aws-sdk/client-sns";

const deletePlatformApplication: AppBlock = {
  name: "Delete Platform Application",
  description:
    "Deletes a platform application object for one of the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging).",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PlatformApplicationArn: {
          name: "Platform Application Arn",
          description:
            "PlatformApplicationArn of platform application object to delete.",
          type: "string",
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

        const command = new DeletePlatformApplicationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Platform Application Result",
      description: "Result from DeletePlatformApplication operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deletePlatformApplication;
