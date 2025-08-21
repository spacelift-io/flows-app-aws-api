import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateDistributionWithStagingConfigCommand,
} from "@aws-sdk/client-cloudfront";

const updateDistributionWithStagingConfig: AppBlock = {
  name: "Update Distribution With Staging Config",
  description:
    "Copies the staging distribution's configuration to its corresponding primary distribution.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description:
            "The identifier of the primary distribution to which you are copying a staging distribution's configuration.",
          type: "string",
          required: true,
        },
        StagingDistributionId: {
          name: "Staging Distribution Id",
          description:
            "The identifier of the staging distribution whose configuration you are copying to the primary distribution.",
          type: "string",
          required: false,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The current versions (ETag values) of both primary and staging distributions.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
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

        const command = new UpdateDistributionWithStagingConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Distribution With Staging Config Result",
      description: "Result from UpdateDistributionWithStagingConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Distribution: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              ARN: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              LastModifiedTime: {
                type: "string",
              },
              InProgressInvalidationBatches: {
                type: "number",
              },
              DomainName: {
                type: "string",
              },
              ActiveTrustedSigners: {
                type: "object",
                properties: {
                  Enabled: {
                    type: "boolean",
                  },
                  Quantity: {
                    type: "number",
                  },
                  Items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        AwsAccountNumber: {
                          type: "object",
                          additionalProperties: true,
                        },
                        KeyPairIds: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                },
                required: ["Enabled", "Quantity"],
                additionalProperties: false,
              },
              ActiveTrustedKeyGroups: {
                type: "object",
                properties: {
                  Enabled: {
                    type: "boolean",
                  },
                  Quantity: {
                    type: "number",
                  },
                  Items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        KeyGroupId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        KeyPairIds: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                },
                required: ["Enabled", "Quantity"],
                additionalProperties: false,
              },
              DistributionConfig: {
                type: "object",
                properties: {
                  CallerReference: {
                    type: "string",
                  },
                  Aliases: {
                    type: "object",
                    properties: {
                      Quantity: {
                        type: "number",
                      },
                      Items: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    required: ["Quantity"],
                    additionalProperties: false,
                  },
                  DefaultRootObject: {
                    type: "string",
                  },
                  Origins: {
                    type: "object",
                    properties: {
                      Quantity: {
                        type: "number",
                      },
                      Items: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    required: ["Quantity", "Items"],
                    additionalProperties: false,
                  },
                  OriginGroups: {
                    type: "object",
                    properties: {
                      Quantity: {
                        type: "number",
                      },
                      Items: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    required: ["Quantity"],
                    additionalProperties: false,
                  },
                  DefaultCacheBehavior: {
                    type: "object",
                    properties: {
                      TargetOriginId: {
                        type: "string",
                      },
                      TrustedSigners: {
                        type: "object",
                        properties: {
                          Enabled: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Quantity: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Items: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["Enabled", "Quantity"],
                        additionalProperties: false,
                      },
                      TrustedKeyGroups: {
                        type: "object",
                        properties: {
                          Enabled: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Quantity: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Items: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["Enabled", "Quantity"],
                        additionalProperties: false,
                      },
                      ViewerProtocolPolicy: {
                        type: "string",
                      },
                      AllowedMethods: {
                        type: "object",
                        properties: {
                          Quantity: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Items: {
                            type: "object",
                            additionalProperties: true,
                          },
                          CachedMethods: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["Quantity", "Items"],
                        additionalProperties: false,
                      },
                      SmoothStreaming: {
                        type: "boolean",
                      },
                      Compress: {
                        type: "boolean",
                      },
                      LambdaFunctionAssociations: {
                        type: "object",
                        properties: {
                          Quantity: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Items: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["Quantity"],
                        additionalProperties: false,
                      },
                      FunctionAssociations: {
                        type: "object",
                        properties: {
                          Quantity: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Items: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["Quantity"],
                        additionalProperties: false,
                      },
                      FieldLevelEncryptionId: {
                        type: "string",
                      },
                      RealtimeLogConfigArn: {
                        type: "string",
                      },
                      CachePolicyId: {
                        type: "string",
                      },
                      OriginRequestPolicyId: {
                        type: "string",
                      },
                      ResponseHeadersPolicyId: {
                        type: "string",
                      },
                      GrpcConfig: {
                        type: "object",
                        properties: {
                          Enabled: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["Enabled"],
                        additionalProperties: false,
                      },
                      ForwardedValues: {
                        type: "object",
                        properties: {
                          QueryString: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Cookies: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Headers: {
                            type: "object",
                            additionalProperties: true,
                          },
                          QueryStringCacheKeys: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["QueryString", "Cookies"],
                        additionalProperties: false,
                      },
                      MinTTL: {
                        type: "number",
                      },
                      DefaultTTL: {
                        type: "number",
                      },
                      MaxTTL: {
                        type: "number",
                      },
                    },
                    required: ["TargetOriginId", "ViewerProtocolPolicy"],
                    additionalProperties: false,
                  },
                  CacheBehaviors: {
                    type: "object",
                    properties: {
                      Quantity: {
                        type: "number",
                      },
                      Items: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    required: ["Quantity"],
                    additionalProperties: false,
                  },
                  CustomErrorResponses: {
                    type: "object",
                    properties: {
                      Quantity: {
                        type: "number",
                      },
                      Items: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    required: ["Quantity"],
                    additionalProperties: false,
                  },
                  Comment: {
                    type: "string",
                  },
                  Logging: {
                    type: "object",
                    properties: {
                      Enabled: {
                        type: "boolean",
                      },
                      IncludeCookies: {
                        type: "boolean",
                      },
                      Bucket: {
                        type: "string",
                      },
                      Prefix: {
                        type: "string",
                      },
                    },
                    additionalProperties: false,
                  },
                  PriceClass: {
                    type: "string",
                  },
                  Enabled: {
                    type: "boolean",
                  },
                  ViewerCertificate: {
                    type: "object",
                    properties: {
                      CloudFrontDefaultCertificate: {
                        type: "boolean",
                      },
                      IAMCertificateId: {
                        type: "string",
                      },
                      ACMCertificateArn: {
                        type: "string",
                      },
                      SSLSupportMethod: {
                        type: "string",
                      },
                      MinimumProtocolVersion: {
                        type: "string",
                      },
                      Certificate: {
                        type: "string",
                      },
                      CertificateSource: {
                        type: "string",
                      },
                    },
                    additionalProperties: false,
                  },
                  Restrictions: {
                    type: "object",
                    properties: {
                      GeoRestriction: {
                        type: "object",
                        properties: {
                          RestrictionType: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Quantity: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Items: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["RestrictionType", "Quantity"],
                        additionalProperties: false,
                      },
                    },
                    required: ["GeoRestriction"],
                    additionalProperties: false,
                  },
                  WebACLId: {
                    type: "string",
                  },
                  HttpVersion: {
                    type: "string",
                  },
                  IsIPV6Enabled: {
                    type: "boolean",
                  },
                  ContinuousDeploymentPolicyId: {
                    type: "string",
                  },
                  Staging: {
                    type: "boolean",
                  },
                  AnycastIpListId: {
                    type: "string",
                  },
                  TenantConfig: {
                    type: "object",
                    properties: {
                      ParameterDefinitions: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    additionalProperties: false,
                  },
                  ConnectionMode: {
                    type: "string",
                  },
                },
                required: [
                  "CallerReference",
                  "Origins",
                  "DefaultCacheBehavior",
                  "Comment",
                  "Enabled",
                ],
                additionalProperties: false,
              },
              AliasICPRecordals: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    CNAME: {
                      type: "string",
                    },
                    ICPRecordalStatus: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            required: [
              "Id",
              "ARN",
              "Status",
              "LastModifiedTime",
              "InProgressInvalidationBatches",
              "DomainName",
              "DistributionConfig",
            ],
            additionalProperties: false,
            description:
              "A distribution tells CloudFront where you want content to be delivered from, and the details about how to track and manage content delivery.",
          },
          ETag: {
            type: "string",
            description:
              "The current version of the primary distribution (after it's updated).",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateDistributionWithStagingConfig;
