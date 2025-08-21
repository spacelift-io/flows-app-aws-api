import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, SetEndpointAttributesCommand } from "@aws-sdk/client-sns";

const setEndpointAttributes: AppBlock = {
  name: "Set Endpoint Attributes",
  description:
    "Sets the attributes for an endpoint for a device on one of the supported push notification services, such as GCM (Firebase Cloud Messaging) and APNS.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EndpointArn: {
          name: "Endpoint Arn",
          description: "EndpointArn used for SetEndpointAttributes action.",
          type: "string",
          required: true,
        },
        Attributes: {
          name: "Attributes",
          description: "A map of the endpoint attributes.",
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

        const command = new SetEndpointAttributesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Set Endpoint Attributes Result",
      description: "Result from SetEndpointAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default setEndpointAttributes;
