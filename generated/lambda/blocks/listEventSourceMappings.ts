import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  ListEventSourceMappingsCommand,
} from "@aws-sdk/client-lambda";

const listEventSourceMappings: AppBlock = {
  name: "List Event Source Mappings",
  description: "Lists event source mappings.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EventSourceArn: {
          name: "Event Source Arn",
          description: "The Amazon Resource Name (ARN) of the event source.",
          type: "string",
          required: false,
        },
        FunctionName: {
          name: "Function Name",
          description: "The name or ARN of the Lambda function.",
          type: "string",
          required: false,
        },
        Marker: {
          name: "Marker",
          description: "A pagination token returned by a previous call.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description: "The maximum number of event source mappings to return.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new LambdaClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListEventSourceMappingsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Event Source Mappings Result",
      description: "Result from ListEventSourceMappings operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "A pagination token that's returned when the response doesn't contain all event source mappings.",
          },
          EventSourceMappings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                UUID: {
                  type: "string",
                },
                StartingPosition: {
                  type: "string",
                },
                StartingPositionTimestamp: {
                  type: "string",
                },
                BatchSize: {
                  type: "number",
                },
                MaximumBatchingWindowInSeconds: {
                  type: "number",
                },
                ParallelizationFactor: {
                  type: "number",
                },
                EventSourceArn: {
                  type: "string",
                },
                FilterCriteria: {
                  type: "object",
                  properties: {
                    Filters: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
                FunctionArn: {
                  type: "string",
                },
                LastModified: {
                  type: "string",
                },
                LastProcessingResult: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                StateTransitionReason: {
                  type: "string",
                },
                DestinationConfig: {
                  type: "object",
                  properties: {
                    OnSuccess: {
                      type: "object",
                      properties: {
                        Destination: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    OnFailure: {
                      type: "object",
                      properties: {
                        Destination: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                Topics: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                Queues: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                SourceAccessConfigurations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Type: {
                        type: "object",
                        additionalProperties: true,
                      },
                      URI: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                SelfManagedEventSource: {
                  type: "object",
                  properties: {
                    Endpoints: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                  },
                  additionalProperties: false,
                },
                MaximumRecordAgeInSeconds: {
                  type: "number",
                },
                BisectBatchOnFunctionError: {
                  type: "boolean",
                },
                MaximumRetryAttempts: {
                  type: "number",
                },
                TumblingWindowInSeconds: {
                  type: "number",
                },
                FunctionResponseTypes: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                AmazonManagedKafkaEventSourceConfig: {
                  type: "object",
                  properties: {
                    ConsumerGroupId: {
                      type: "string",
                    },
                    SchemaRegistryConfig: {
                      type: "object",
                      properties: {
                        SchemaRegistryURI: {
                          type: "object",
                          additionalProperties: true,
                        },
                        EventRecordFormat: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AccessConfigs: {
                          type: "object",
                          additionalProperties: true,
                        },
                        SchemaValidationConfigs: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                SelfManagedKafkaEventSourceConfig: {
                  type: "object",
                  properties: {
                    ConsumerGroupId: {
                      type: "string",
                    },
                    SchemaRegistryConfig: {
                      type: "object",
                      properties: {
                        SchemaRegistryURI: {
                          type: "object",
                          additionalProperties: true,
                        },
                        EventRecordFormat: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AccessConfigs: {
                          type: "object",
                          additionalProperties: true,
                        },
                        SchemaValidationConfigs: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                ScalingConfig: {
                  type: "object",
                  properties: {
                    MaximumConcurrency: {
                      type: "number",
                    },
                  },
                  additionalProperties: false,
                },
                DocumentDBEventSourceConfig: {
                  type: "object",
                  properties: {
                    DatabaseName: {
                      type: "string",
                    },
                    CollectionName: {
                      type: "string",
                    },
                    FullDocument: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                KMSKeyArn: {
                  type: "string",
                },
                FilterCriteriaError: {
                  type: "object",
                  properties: {
                    ErrorCode: {
                      type: "string",
                    },
                    Message: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                EventSourceMappingArn: {
                  type: "string",
                },
                MetricsConfig: {
                  type: "object",
                  properties: {
                    Metrics: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                  },
                  additionalProperties: false,
                },
                ProvisionedPollerConfig: {
                  type: "object",
                  properties: {
                    MinimumPollers: {
                      type: "number",
                    },
                    MaximumPollers: {
                      type: "number",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "A list of event source mappings.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listEventSourceMappings;
