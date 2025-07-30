import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  GetPlatformApplicationAttributesCommand,
} from "@aws-sdk/client-sns";

const getPlatformApplicationAttributes: AppBlock = {
  name: "Get Platform Application Attributes",
  description:
    "Retrieves the attributes of the platform application object for the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging).",
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
            "PlatformApplicationArn for GetPlatformApplicationAttributesInput.",
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
        });

        const command = new GetPlatformApplicationAttributesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Platform Application Attributes Result",
      description: "Result from GetPlatformApplicationAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Attributes: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Attributes include the following: AppleCertificateExpiryDate – The expiry date of the SSL certificate used to configure certificate-based authentication.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getPlatformApplicationAttributes;
