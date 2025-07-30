import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  DescribeApiDestinationCommand,
} from "@aws-sdk/client-eventbridge";

const describeApiDestination: AppBlock = {
  name: "Describe Api Destination",
  description: "Retrieves details about an API destination.",
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
          description: "The name of the API destination to retrieve.",
          type: "string",
          required: true,
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

        const command = new DescribeApiDestinationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Api Destination Result",
      description: "Result from DescribeApiDestination operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ApiDestinationArn: {
            type: "string",
            description: "The ARN of the API destination retrieved.",
          },
          Name: {
            type: "string",
            description: "The name of the API destination retrieved.",
          },
          Description: {
            type: "string",
            description: "The description for the API destination retrieved.",
          },
          ApiDestinationState: {
            type: "string",
            description: "The state of the API destination retrieved.",
          },
          ConnectionArn: {
            type: "string",
            description:
              "The ARN of the connection specified for the API destination retrieved.",
          },
          InvocationEndpoint: {
            type: "string",
            description: "The URL to use to connect to the HTTP endpoint.",
          },
          HttpMethod: {
            type: "string",
            description: "The method to use to connect to the HTTP endpoint.",
          },
          InvocationRateLimitPerSecond: {
            type: "number",
            description:
              "The maximum number of invocations per second to specified for the API destination.",
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

export default describeApiDestination;
