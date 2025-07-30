import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  ListVersionsByFunctionCommand,
} from "@aws-sdk/client-lambda";

const listVersionsByFunction: AppBlock = {
  name: "List Versions By Function",
  description:
    "Returns a list of versions, with the version-specific configuration of each.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        FunctionName: {
          name: "Function Name",
          description: "The name or ARN of the Lambda function.",
          type: "string",
          required: true,
        },
        Marker: {
          name: "Marker",
          description:
            "Specify the pagination token that's returned by a previous request to retrieve the next page of results.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description: "The maximum number of versions to return.",
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

        const command = new ListVersionsByFunctionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Versions By Function Result",
      description: "Result from ListVersionsByFunction operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "The pagination token that's included if more results are available.",
          },
          Versions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                FunctionName: {
                  type: "string",
                },
                FunctionArn: {
                  type: "string",
                },
                Runtime: {
                  type: "string",
                },
                Role: {
                  type: "string",
                },
                Handler: {
                  type: "string",
                },
                CodeSize: {
                  type: "number",
                },
                Description: {
                  type: "string",
                },
                Timeout: {
                  type: "number",
                },
                MemorySize: {
                  type: "number",
                },
                LastModified: {
                  type: "string",
                },
                CodeSha256: {
                  type: "string",
                },
                Version: {
                  type: "string",
                },
                VpcConfig: {
                  type: "object",
                  properties: {
                    SubnetIds: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    SecurityGroupIds: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    VpcId: {
                      type: "string",
                    },
                    Ipv6AllowedForDualStack: {
                      type: "boolean",
                    },
                  },
                  additionalProperties: false,
                },
                DeadLetterConfig: {
                  type: "object",
                  properties: {
                    TargetArn: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                Environment: {
                  type: "object",
                  properties: {
                    Variables: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    Error: {
                      type: "object",
                      properties: {
                        ErrorCode: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Message: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                KMSKeyArn: {
                  type: "string",
                },
                TracingConfig: {
                  type: "object",
                  properties: {
                    Mode: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                MasterArn: {
                  type: "string",
                },
                RevisionId: {
                  type: "string",
                },
                Layers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Arn: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CodeSize: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SigningProfileVersionArn: {
                        type: "object",
                        additionalProperties: true,
                      },
                      SigningJobArn: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                State: {
                  type: "string",
                },
                StateReason: {
                  type: "string",
                },
                StateReasonCode: {
                  type: "string",
                },
                LastUpdateStatus: {
                  type: "string",
                },
                LastUpdateStatusReason: {
                  type: "string",
                },
                LastUpdateStatusReasonCode: {
                  type: "string",
                },
                FileSystemConfigs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Arn: {
                        type: "object",
                        additionalProperties: true,
                      },
                      LocalMountPath: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Arn", "LocalMountPath"],
                    additionalProperties: false,
                  },
                },
                PackageType: {
                  type: "string",
                },
                ImageConfigResponse: {
                  type: "object",
                  properties: {
                    ImageConfig: {
                      type: "object",
                      properties: {
                        EntryPoint: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Command: {
                          type: "object",
                          additionalProperties: true,
                        },
                        WorkingDirectory: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    Error: {
                      type: "object",
                      properties: {
                        ErrorCode: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Message: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                SigningProfileVersionArn: {
                  type: "string",
                },
                SigningJobArn: {
                  type: "string",
                },
                Architectures: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                EphemeralStorage: {
                  type: "object",
                  properties: {
                    Size: {
                      type: "number",
                    },
                  },
                  required: ["Size"],
                  additionalProperties: false,
                },
                SnapStart: {
                  type: "object",
                  properties: {
                    ApplyOn: {
                      type: "string",
                    },
                    OptimizationStatus: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                RuntimeVersionConfig: {
                  type: "object",
                  properties: {
                    RuntimeVersionArn: {
                      type: "string",
                    },
                    Error: {
                      type: "object",
                      properties: {
                        ErrorCode: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Message: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                  additionalProperties: false,
                },
                LoggingConfig: {
                  type: "object",
                  properties: {
                    LogFormat: {
                      type: "string",
                    },
                    ApplicationLogLevel: {
                      type: "string",
                    },
                    SystemLogLevel: {
                      type: "string",
                    },
                    LogGroup: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "A list of Lambda function versions.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listVersionsByFunction;
