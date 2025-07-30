import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  DescribeEndpointCommand,
} from "@aws-sdk/client-eventbridge";

const describeEndpoint: AppBlock = {
  name: "Describe Endpoint",
  description: "Get the information about an existing global endpoint.",
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
            "The name of the endpoint you want to get information about.",
          type: "string",
          required: true,
        },
        HomeRegion: {
          name: "Home Region",
          description:
            "The primary Region of the endpoint you want to get information about.",
          type: "string",
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

        const command = new DescribeEndpointCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Endpoint Result",
      description: "Result from DescribeEndpoint operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Name: {
            type: "string",
            description:
              "The name of the endpoint you asked for information about.",
          },
          Description: {
            type: "string",
            description:
              "The description of the endpoint you asked for information about.",
          },
          Arn: {
            type: "string",
            description:
              "The ARN of the endpoint you asked for information about.",
          },
          RoutingConfig: {
            type: "object",
            properties: {
              FailoverConfig: {
                type: "object",
                properties: {
                  Primary: {
                    type: "object",
                    properties: {
                      HealthCheck: {
                        type: "string",
                      },
                    },
                    required: ["HealthCheck"],
                    additionalProperties: false,
                  },
                  Secondary: {
                    type: "object",
                    properties: {
                      Route: {
                        type: "string",
                      },
                    },
                    required: ["Route"],
                    additionalProperties: false,
                  },
                },
                required: ["Primary", "Secondary"],
                additionalProperties: false,
              },
            },
            required: ["FailoverConfig"],
            additionalProperties: false,
            description:
              "The routing configuration of the endpoint you asked for information about.",
          },
          ReplicationConfig: {
            type: "object",
            properties: {
              State: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Whether replication is enabled or disabled for the endpoint you asked for information about.",
          },
          EventBuses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                EventBusArn: {
                  type: "string",
                },
              },
              required: ["EventBusArn"],
              additionalProperties: false,
            },
            description:
              "The event buses being used by the endpoint you asked for information about.",
          },
          RoleArn: {
            type: "string",
            description:
              "The ARN of the role used by the endpoint you asked for information about.",
          },
          EndpointId: {
            type: "string",
            description:
              "The ID of the endpoint you asked for information about.",
          },
          EndpointUrl: {
            type: "string",
            description:
              "The URL of the endpoint you asked for information about.",
          },
          State: {
            type: "string",
            description:
              "The current state of the endpoint you asked for information about.",
          },
          StateReason: {
            type: "string",
            description:
              "The reason the endpoint you asked for information about is in its current state.",
          },
          CreationTime: {
            type: "string",
            description:
              "The time the endpoint you asked for information about was created.",
          },
          LastModifiedTime: {
            type: "string",
            description:
              "The last time the endpoint you asked for information about was modified.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeEndpoint;
