import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  SetPlatformApplicationAttributesCommand,
} from "@aws-sdk/client-sns";

const setPlatformApplicationAttributes: AppBlock = {
  name: "Set Platform Application Attributes",
  description:
    "Sets the attributes of the platform application object for the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging).",
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
            "PlatformApplicationArn for SetPlatformApplicationAttributes action.",
          type: "string",
          required: true,
        },
        Attributes: {
          name: "Attributes",
          description: "A map of the platform application attributes.",
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

        const command = new SetPlatformApplicationAttributesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Platform Application Attributes Result",
      description: "Result from SetPlatformApplicationAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default setPlatformApplicationAttributes;
