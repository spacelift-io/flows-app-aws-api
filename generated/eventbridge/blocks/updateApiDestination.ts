import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  UpdateApiDestinationCommand,
} from "@aws-sdk/client-eventbridge";

const updateApiDestination: AppBlock = {
  name: "Update Api Destination",
  description: "Updates an API destination.",
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
          description: "The name of the API destination to update.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "The name of the API destination to update.",
          type: "string",
          required: false,
        },
        ConnectionArn: {
          name: "Connection Arn",
          description:
            "The ARN of the connection to use for the API destination.",
          type: "string",
          required: false,
        },
        InvocationEndpoint: {
          name: "Invocation Endpoint",
          description:
            "The URL to the endpoint to use for the API destination.",
          type: "string",
          required: false,
        },
        HttpMethod: {
          name: "Http Method",
          description: "The method to use for the API destination.",
          type: "string",
          required: false,
        },
        InvocationRateLimitPerSecond: {
          name: "Invocation Rate Limit Per Second",
          description:
            "The maximum number of invocations per second to send to the API destination.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EventBridgeClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new UpdateApiDestinationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Api Destination Result",
      description: "Result from UpdateApiDestination operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ApiDestinationArn: {
            type: "string",
            description: "The ARN of the API destination that was updated.",
          },
          ApiDestinationState: {
            type: "string",
            description: "The state of the API destination that was updated.",
          },
          CreationTime: {
            type: "string",
            description:
              "A time stamp for the time that the API destination was created.",
          },
          LastModifiedTime: {
            type: "string",
            description:
              "A time stamp for the time that the API destination was last modified.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateApiDestination;
