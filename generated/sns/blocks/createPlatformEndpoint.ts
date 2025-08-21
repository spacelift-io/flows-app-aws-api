import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, CreatePlatformEndpointCommand } from "@aws-sdk/client-sns";

const createPlatformEndpoint: AppBlock = {
  name: "Create Platform Endpoint",
  description:
    "Creates an endpoint for a device and mobile app on one of the supported push notification services, such as GCM (Firebase Cloud Messaging) and APNS.",
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
            "PlatformApplicationArn returned from CreatePlatformApplication is used to create a an endpoint.",
          type: "string",
          required: true,
        },
        Token: {
          name: "Token",
          description:
            "Unique identifier created by the notification service for an app on a device.",
          type: "string",
          required: true,
        },
        CustomUserData: {
          name: "Custom User Data",
          description: "Arbitrary user data to associate with the endpoint.",
          type: "string",
          required: false,
        },
        Attributes: {
          name: "Attributes",
          description: "For a list of attributes, see SetEndpointAttributes .",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: false,
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

        const command = new CreatePlatformEndpointCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Platform Endpoint Result",
      description: "Result from CreatePlatformEndpoint operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EndpointArn: {
            type: "string",
            description: "EndpointArn returned from CreateEndpoint action.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createPlatformEndpoint;
