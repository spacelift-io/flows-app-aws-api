import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  CreateEventSourceMappingCommand,
} from "@aws-sdk/client-lambda";

const createEventSourceMapping: AppBlock = {
  name: "Create Event Source Mapping",
  description:
    "Creates a mapping between an event source and an Lambda function.",
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
          required: true,
        },
        Enabled: {
          name: "Enabled",
          description: "When true, the event source mapping is active.",
          type: "boolean",
          required: false,
        },
        BatchSize: {
          name: "Batch Size",
          description:
            "The maximum number of records in each batch that Lambda pulls from your stream or queue and sends to your function.",
          type: "number",
          required: false,
        },
        FilterCriteria: {
          name: "Filter Criteria",
          description:
            "An object that defines the filter criteria that determine whether Lambda should process an event.",
          type: {
            type: "object",
            properties: {
              Filters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Pattern: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        MaximumBatchingWindowInSeconds: {
          name: "Maximum Batching Window In Seconds",
          description:
            "The maximum amount of time, in seconds, that Lambda spends gathering records before invoking the function.",
          type: "number",
          required: false,
        },
        ParallelizationFactor: {
          name: "Parallelization Factor",
          description:
            "(Kinesis and DynamoDB Streams only) The number of batches to process from each shard concurrently.",
          type: "number",
          required: false,
        },
        StartingPosition: {
          name: "Starting Position",
          description: "The position in a stream from which to start reading.",
          type: "string",
          required: false,
        },
        StartingPositionTimestamp: {
          name: "Starting Position Timestamp",
          description:
            "With StartingPosition set to AT_TIMESTAMP, the time from which to start reading.",
          type: "string",
          required: false,
        },
        DestinationConfig: {
          name: "Destination Config",
          description:
            "(Kinesis, DynamoDB Streams, Amazon MSK, and self-managed Kafka only) A configuration object that specifies the destination of an event after Lambda processes it.",
          type: {
            type: "object",
            properties: {
              OnSuccess: {
                type: "object",
                properties: {
                  Destination: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              OnFailure: {
                type: "object",
                properties: {
                  Destination: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        MaximumRecordAgeInSeconds: {
          name: "Maximum Record Age In Seconds",
          description:
            "(Kinesis and DynamoDB Streams only) Discard records older than the specified age.",
          type: "number",
          required: false,
        },
        BisectBatchOnFunctionError: {
          name: "Bisect Batch On Function Error",
          description:
            "(Kinesis and DynamoDB Streams only) If the function returns an error, split the batch in two and retry.",
          type: "boolean",
          required: false,
        },
        MaximumRetryAttempts: {
          name: "Maximum Retry Attempts",
          description:
            "(Kinesis and DynamoDB Streams only) Discard records after the specified number of retries.",
          type: "number",
          required: false,
        },
        Tags: {
          name: "Tags",
          description: "A list of tags to apply to the event source mapping.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
          required: false,
        },
        TumblingWindowInSeconds: {
          name: "Tumbling Window In Seconds",
          description:
            "(Kinesis and DynamoDB Streams only) The duration in seconds of a processing window for DynamoDB and Kinesis Streams event sources.",
          type: "number",
          required: false,
        },
        Topics: {
          name: "Topics",
          description: "The name of the Kafka topic.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Queues: {
          name: "Queues",
          description:
            "(MQ) The name of the Amazon MQ broker destination queue to consume.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        SourceAccessConfigurations: {
          name: "Source Access Configurations",
          description:
            "An array of authentication protocols or VPC components required to secure your event source.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Type: {
                  type: "string",
                },
                URI: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        SelfManagedEventSource: {
          name: "Self Managed Event Source",
          description:
            "The self-managed Apache Kafka cluster to receive records from.",
          type: {
            type: "object",
            properties: {
              Endpoints: {
                type: "object",
                additionalProperties: {
                  type: "array",
                },
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        FunctionResponseTypes: {
          name: "Function Response Types",
          description:
            "(Kinesis, DynamoDB Streams, and Amazon SQS) A list of current response type enums applied to the event source mapping.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        AmazonManagedKafkaEventSourceConfig: {
          name: "Amazon Managed Kafka Event Source Config",
          description:
            "Specific configuration settings for an Amazon Managed Streaming for Apache Kafka (Amazon MSK) event source.",
          type: {
            type: "object",
            properties: {
              ConsumerGroupId: {
                type: "string",
              },
              SchemaRegistryConfig: {
                type: "object",
                properties: {
                  SchemaRegistryURI: {
                    type: "string",
                  },
                  EventRecordFormat: {
                    type: "string",
                  },
                  AccessConfigs: {
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
                  SchemaValidationConfigs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        Attribute: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        SelfManagedKafkaEventSourceConfig: {
          name: "Self Managed Kafka Event Source Config",
          description:
            "Specific configuration settings for a self-managed Apache Kafka event source.",
          type: {
            type: "object",
            properties: {
              ConsumerGroupId: {
                type: "string",
              },
              SchemaRegistryConfig: {
                type: "object",
                properties: {
                  SchemaRegistryURI: {
                    type: "string",
                  },
                  EventRecordFormat: {
                    type: "string",
                  },
                  AccessConfigs: {
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
                  SchemaValidationConfigs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        Attribute: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        ScalingConfig: {
          name: "Scaling Config",
          description:
            "(Amazon SQS only) The scaling configuration for the event source.",
          type: {
            type: "object",
            properties: {
              MaximumConcurrency: {
                type: "number",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        DocumentDBEventSourceConfig: {
          name: "Document DB Event Source Config",
          description:
            "Specific configuration settings for a DocumentDB event source.",
          type: {
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
          required: false,
        },
        KMSKeyArn: {
          name: "KMS Key Arn",
          description:
            "The ARN of the Key Management Service (KMS) customer managed key that Lambda uses to encrypt your function's filter criteria.",
          type: "string",
          required: false,
        },
        MetricsConfig: {
          name: "Metrics Config",
          description: "The metrics configuration for your event source.",
          type: {
            type: "object",
            properties: {
              Metrics: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        ProvisionedPollerConfig: {
          name: "Provisioned Poller Config",
          description:
            "(Amazon MSK and self-managed Apache Kafka only) The provisioned mode configuration for the event source.",
          type: {
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateEventSourceMappingCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Event Source Mapping Result",
      description: "Result from CreateEventSourceMapping operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          UUID: {
            type: "string",
            description: "The identifier of the event source mapping.",
          },
          StartingPosition: {
            type: "string",
            description:
              "The position in a stream from which to start reading.",
          },
          StartingPositionTimestamp: {
            type: "string",
            description:
              "With StartingPosition set to AT_TIMESTAMP, the time from which to start reading.",
          },
          BatchSize: {
            type: "number",
            description:
              "The maximum number of records in each batch that Lambda pulls from your stream or queue and sends to your function.",
          },
          MaximumBatchingWindowInSeconds: {
            type: "number",
            description:
              "The maximum amount of time, in seconds, that Lambda spends gathering records before invoking the function.",
          },
          ParallelizationFactor: {
            type: "number",
            description:
              "(Kinesis and DynamoDB Streams only) The number of batches to process concurrently from each shard.",
          },
          EventSourceArn: {
            type: "string",
            description: "The Amazon Resource Name (ARN) of the event source.",
          },
          FilterCriteria: {
            type: "object",
            properties: {
              Filters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Pattern: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "An object that defines the filter criteria that determine whether Lambda should process an event.",
          },
          FunctionArn: {
            type: "string",
            description: "The ARN of the Lambda function.",
          },
          LastModified: {
            type: "string",
            description:
              "The date that the event source mapping was last updated or that its state changed.",
          },
          LastProcessingResult: {
            type: "string",
            description:
              "The result of the event source mapping's last processing attempt.",
          },
          State: {
            type: "string",
            description: "The state of the event source mapping.",
          },
          StateTransitionReason: {
            type: "string",
            description:
              "Indicates whether a user or Lambda made the last change to the event source mapping.",
          },
          DestinationConfig: {
            type: "object",
            properties: {
              OnSuccess: {
                type: "object",
                properties: {
                  Destination: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              OnFailure: {
                type: "object",
                properties: {
                  Destination: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description:
              "(Kinesis, DynamoDB Streams, Amazon MSK, and self-managed Apache Kafka event sources only) A configuration object that specifies the destination of an event after Lambda processes it.",
          },
          Topics: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The name of the Kafka topic.",
          },
          Queues: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "(Amazon MQ) The name of the Amazon MQ broker destination queue to consume.",
          },
          SourceAccessConfigurations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Type: {
                  type: "string",
                },
                URI: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "An array of the authentication protocol, VPC components, or virtual host to secure and define your event source.",
          },
          SelfManagedEventSource: {
            type: "object",
            properties: {
              Endpoints: {
                type: "object",
                additionalProperties: {
                  type: "array",
                },
              },
            },
            additionalProperties: false,
            description:
              "The self-managed Apache Kafka cluster for your event source.",
          },
          MaximumRecordAgeInSeconds: {
            type: "number",
            description:
              "(Kinesis and DynamoDB Streams only) Discard records older than the specified age.",
          },
          BisectBatchOnFunctionError: {
            type: "boolean",
            description:
              "(Kinesis and DynamoDB Streams only) If the function returns an error, split the batch in two and retry.",
          },
          MaximumRetryAttempts: {
            type: "number",
            description:
              "(Kinesis and DynamoDB Streams only) Discard records after the specified number of retries.",
          },
          TumblingWindowInSeconds: {
            type: "number",
            description:
              "(Kinesis and DynamoDB Streams only) The duration in seconds of a processing window for DynamoDB and Kinesis Streams event sources.",
          },
          FunctionResponseTypes: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "(Kinesis, DynamoDB Streams, and Amazon SQS) A list of current response type enums applied to the event source mapping.",
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
                    type: "string",
                  },
                  EventRecordFormat: {
                    type: "string",
                  },
                  AccessConfigs: {
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
                  SchemaValidationConfigs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        Attribute: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description:
              "Specific configuration settings for an Amazon Managed Streaming for Apache Kafka (Amazon MSK) event source.",
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
                    type: "string",
                  },
                  EventRecordFormat: {
                    type: "string",
                  },
                  AccessConfigs: {
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
                  SchemaValidationConfigs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        Attribute: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description:
              "Specific configuration settings for a self-managed Apache Kafka event source.",
          },
          ScalingConfig: {
            type: "object",
            properties: {
              MaximumConcurrency: {
                type: "number",
              },
            },
            additionalProperties: false,
            description:
              "(Amazon SQS only) The scaling configuration for the event source.",
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
            description:
              "Specific configuration settings for a DocumentDB event source.",
          },
          KMSKeyArn: {
            type: "string",
            description:
              "The ARN of the Key Management Service (KMS) customer managed key that Lambda uses to encrypt your function's filter criteria.",
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
            description:
              "An object that contains details about an error related to filter criteria encryption.",
          },
          EventSourceMappingArn: {
            type: "string",
            description:
              "The Amazon Resource Name (ARN) of the event source mapping.",
          },
          MetricsConfig: {
            type: "object",
            properties: {
              Metrics: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
            description: "The metrics configuration for your event source.",
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
            description:
              "(Amazon MSK and self-managed Apache Kafka only) The provisioned mode configuration for the event source.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createEventSourceMapping;
