import { AppBlock, events } from "@slflows/sdk/v1";
import { SNSClient, GetEndpointAttributesCommand } from "@aws-sdk/client-sns";

const getEndpointAttributes: AppBlock = {
  name: "Get Endpoint Attributes",
  description:
    "Retrieves the endpoint attributes for a device on one of the supported push notification services, such as GCM (Firebase Cloud Messaging) and APNS.",
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
          description: "EndpointArn for GetEndpointAttributes input.",
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

        const command = new GetEndpointAttributesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Endpoint Attributes Result",
      description: "Result from GetEndpointAttributes operation",
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
              "Attributes include the following: CustomUserData – arbitrary user data to associate with the endpoint.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getEndpointAttributes;
