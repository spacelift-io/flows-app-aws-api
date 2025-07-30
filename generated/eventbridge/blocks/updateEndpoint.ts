import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EventBridgeClient,
  UpdateEndpointCommand,
} from "@aws-sdk/client-eventbridge";

const updateEndpoint: AppBlock = {
  name: "Update Endpoint",
  description: "Update an existing endpoint.",
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
          description: "The name of the endpoint you want to update.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "A description for the endpoint.",
          type: "string",
          required: false,
        },
        RoutingConfig: {
          name: "Routing Config",
          description:
            "Configure the routing policy, including the health check and secondary Region.",
          type: {
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
          },
          required: false,
        },
        ReplicationConfig: {
          name: "Replication Config",
          description:
            "Whether event replication was enabled or disabled by this request.",
          type: {
            type: "object",
            properties: {
              State: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        EventBuses: {
          name: "Event Buses",
          description: "Define event buses used for replication.",
          type: {
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
          },
          required: false,
        },
        RoleArn: {
          name: "Role Arn",
          description:
            "The ARN of the role used by event replication for this request.",
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

        const command = new UpdateEndpointCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Endpoint Result",
      description: "Result from UpdateEndpoint operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Name: {
            type: "string",
            description:
              "The name of the endpoint you updated in this request.",
          },
          Arn: {
            type: "string",
            description: "The ARN of the endpoint you updated in this request.",
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
              "The routing configuration you updated in this request.",
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
              "Whether event replication was enabled or disabled for the endpoint you updated in this request.",
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
              "The event buses used for replication for the endpoint you updated in this request.",
          },
          RoleArn: {
            type: "string",
            description:
              "The ARN of the role used by event replication for the endpoint you updated in this request.",
          },
          EndpointId: {
            type: "string",
            description: "The ID of the endpoint you updated in this request.",
          },
          EndpointUrl: {
            type: "string",
            description: "The URL of the endpoint you updated in this request.",
          },
          State: {
            type: "string",
            description:
              "The state of the endpoint you updated in this request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateEndpoint;
