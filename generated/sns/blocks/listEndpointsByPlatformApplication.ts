import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  ListEndpointsByPlatformApplicationCommand,
} from "@aws-sdk/client-sns";

const listEndpointsByPlatformApplication: AppBlock = {
  name: "List Endpoints By Platform Application",
  description:
    "Lists the endpoints and endpoint attributes for devices in a supported push notification service, such as GCM (Firebase Cloud Messaging) and APNS.",
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
            "PlatformApplicationArn for ListEndpointsByPlatformApplicationInput action.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "NextToken string is used when calling ListEndpointsByPlatformApplication action to retrieve additional records that are available after the first page results.",
          type: "string",
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
        });

        const command = new ListEndpointsByPlatformApplicationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Endpoints By Platform Application Result",
      description: "Result from ListEndpointsByPlatformApplication operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Endpoints: {
            type: "array",
            items: {
              type: "object",
              properties: {
                EndpointArn: {
                  type: "string",
                },
                Attributes: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "Endpoints returned for ListEndpointsByPlatformApplication action.",
          },
          NextToken: {
            type: "string",
            description:
              "NextToken string is returned when calling ListEndpointsByPlatformApplication action if additional records are available after the first page results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listEndpointsByPlatformApplication;
