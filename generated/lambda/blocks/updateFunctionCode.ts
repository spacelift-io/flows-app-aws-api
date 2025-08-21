import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  UpdateFunctionCodeCommand,
} from "@aws-sdk/client-lambda";

const updateFunctionCode: AppBlock = {
  name: "Update Function Code",
  description: "Updates a Lambda function's code.",
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
        ZipFile: {
          name: "Zip File",
          description: "The base64-encoded contents of the deployment package.",
          type: "string",
          required: false,
        },
        S3Bucket: {
          name: "S3Bucket",
          description:
            "An Amazon S3 bucket in the same Amazon Web Services Region as your function.",
          type: "string",
          required: false,
        },
        S3Key: {
          name: "S3Key",
          description: "The Amazon S3 key of the deployment package.",
          type: "string",
          required: false,
        },
        S3ObjectVersion: {
          name: "S3Object Version",
          description:
            "For versioned objects, the version of the deployment package object to use.",
          type: "string",
          required: false,
        },
        ImageUri: {
          name: "Image Uri",
          description: "URI of a container image in the Amazon ECR registry.",
          type: "string",
          required: false,
        },
        Publish: {
          name: "Publish",
          description:
            "Set to true to publish a new version of the function after updating the code.",
          type: "boolean",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Set to true to validate the request parameters and access permissions without modifying the function code.",
          type: "boolean",
          required: false,
        },
        RevisionId: {
          name: "Revision Id",
          description:
            "Update the function only if the revision ID matches the ID that's specified.",
          type: "string",
          required: false,
        },
        Architectures: {
          name: "Architectures",
          description:
            "The instruction set architecture that the function supports.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        SourceKMSKeyArn: {
          name: "Source KMS Key Arn",
          description:
            "The ARN of the Key Management Service (KMS) customer managed key that's used to encrypt your function's .",
          type: "string",
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

        const command = new UpdateFunctionCodeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Function Code Result",
      description: "Result from UpdateFunctionCode operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FunctionName: {
            type: "string",
            description: "The name of the function.",
          },
          FunctionArn: {
            type: "string",
            description: "The function's Amazon Resource Name (ARN).",
          },
          Runtime: {
            type: "string",
            description: "The identifier of the function's runtime.",
          },
          Role: {
            type: "string",
            description: "The function's execution role.",
          },
          Handler: {
            type: "string",
            description:
              "The function that Lambda calls to begin running your function.",
          },
          CodeSize: {
            type: "number",
            description:
              "The size of the function's deployment package, in bytes.",
          },
          Description: {
            type: "string",
            description: "The function's description.",
          },
          Timeout: {
            type: "number",
            description:
              "The amount of time in seconds that Lambda allows a function to run before stopping it.",
          },
          MemorySize: {
            type: "number",
            description:
              "The amount of memory available to the function at runtime.",
          },
          LastModified: {
            type: "string",
            description:
              "The date and time that the function was last updated, in ISO-8601 format (YYYY-MM-DDThh:mm:ss.",
          },
          CodeSha256: {
            type: "string",
            description:
              "The SHA256 hash of the function's deployment package.",
          },
          Version: {
            type: "string",
            description: "The version of the Lambda function.",
          },
          VpcConfig: {
            type: "object",
            properties: {
              SubnetIds: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              SecurityGroupIds: {
                type: "array",
                items: {
                  type: "string",
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
            description: "The function's networking configuration.",
          },
          DeadLetterConfig: {
            type: "object",
            properties: {
              TargetArn: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The function's dead letter queue.",
          },
          Environment: {
            type: "object",
            properties: {
              Variables: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
              Error: {
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
            },
            additionalProperties: false,
            description: "The function's environment variables.",
          },
          KMSKeyArn: {
            type: "string",
            description:
              "The ARN of the Key Management Service (KMS) customer managed key that's used to encrypt the following resources: The function's environment variables.",
          },
          TracingConfig: {
            type: "object",
            properties: {
              Mode: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The function's X-Ray tracing configuration.",
          },
          MasterArn: {
            type: "string",
            description:
              "For Lambda@Edge functions, the ARN of the main function.",
          },
          RevisionId: {
            type: "string",
            description:
              "The latest updated revision of the function or alias.",
          },
          Layers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Arn: {
                  type: "string",
                },
                CodeSize: {
                  type: "number",
                },
                SigningProfileVersionArn: {
                  type: "string",
                },
                SigningJobArn: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The function's layers.",
          },
          State: {
            type: "string",
            description: "The current state of the function.",
          },
          StateReason: {
            type: "string",
            description: "The reason for the function's current state.",
          },
          StateReasonCode: {
            type: "string",
            description: "The reason code for the function's current state.",
          },
          LastUpdateStatus: {
            type: "string",
            description:
              "The status of the last update that was performed on the function.",
          },
          LastUpdateStatusReason: {
            type: "string",
            description:
              "The reason for the last update that was performed on the function.",
          },
          LastUpdateStatusReasonCode: {
            type: "string",
            description:
              "The reason code for the last update that was performed on the function.",
          },
          FileSystemConfigs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Arn: {
                  type: "string",
                },
                LocalMountPath: {
                  type: "string",
                },
              },
              required: ["Arn", "LocalMountPath"],
              additionalProperties: false,
            },
            description: "Connection settings for an Amazon EFS file system.",
          },
          PackageType: {
            type: "string",
            description: "The type of deployment package.",
          },
          ImageConfigResponse: {
            type: "object",
            properties: {
              ImageConfig: {
                type: "object",
                properties: {
                  EntryPoint: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  Command: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  WorkingDirectory: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              Error: {
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
            },
            additionalProperties: false,
            description: "The function's image configuration values.",
          },
          SigningProfileVersionArn: {
            type: "string",
            description: "The ARN of the signing profile version.",
          },
          SigningJobArn: {
            type: "string",
            description: "The ARN of the signing job.",
          },
          Architectures: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The instruction set architecture that the function supports.",
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
            description: "The size of the function's /tmp directory in MB.",
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
            description:
              "Set ApplyOn to PublishedVersions to create a snapshot of the initialized execution environment when you publish a function version.",
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
                    type: "string",
                  },
                  Message: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description: "The ARN of the runtime and any errors that occured.",
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
            description:
              "The function's Amazon CloudWatch Logs configuration settings.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateFunctionCode;
