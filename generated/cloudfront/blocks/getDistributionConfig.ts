import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetDistributionConfigCommand,
} from "@aws-sdk/client-cloudfront";

const getDistributionConfig: AppBlock = {
  name: "Get Distribution Config",
  description: "Get the configuration information about a distribution.",
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
          description: "The distribution's ID.",
          type: "string",
          required: true,
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
        });

        const command = new GetDistributionConfigCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Distribution Config Result",
      description: "Result from GetDistributionConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
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
                      type: "string",
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
                      properties: {
                        Id: {
                          type: "object",
                          additionalProperties: true,
                        },
                        DomainName: {
                          type: "object",
                          additionalProperties: true,
                        },
                        OriginPath: {
                          type: "object",
                          additionalProperties: true,
                        },
                        CustomHeaders: {
                          type: "object",
                          additionalProperties: true,
                        },
                        S3OriginConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        CustomOriginConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        VpcOriginConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ConnectionAttempts: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ConnectionTimeout: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ResponseCompletionTimeout: {
                          type: "object",
                          additionalProperties: true,
                        },
                        OriginShield: {
                          type: "object",
                          additionalProperties: true,
                        },
                        OriginAccessControlId: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Id", "DomainName"],
                      additionalProperties: false,
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
                      properties: {
                        Id: {
                          type: "object",
                          additionalProperties: true,
                        },
                        FailoverCriteria: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Members: {
                          type: "object",
                          additionalProperties: true,
                        },
                        SelectionCriteria: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Id", "FailoverCriteria", "Members"],
                      additionalProperties: false,
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
                        type: "boolean",
                      },
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
                    required: ["Enabled", "Quantity"],
                    additionalProperties: false,
                  },
                  TrustedKeyGroups: {
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
                          additionalProperties: true,
                        },
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
                        type: "number",
                      },
                      Items: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      CachedMethods: {
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
                        required: ["Quantity", "Items"],
                        additionalProperties: false,
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
                  FunctionAssociations: {
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
                        type: "boolean",
                      },
                    },
                    required: ["Enabled"],
                    additionalProperties: false,
                  },
                  ForwardedValues: {
                    type: "object",
                    properties: {
                      QueryString: {
                        type: "boolean",
                      },
                      Cookies: {
                        type: "object",
                        properties: {
                          Forward: {
                            type: "object",
                            additionalProperties: true,
                          },
                          WhitelistedNames: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["Forward"],
                        additionalProperties: false,
                      },
                      Headers: {
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
                      QueryStringCacheKeys: {
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
                      properties: {
                        PathPattern: {
                          type: "object",
                          additionalProperties: true,
                        },
                        TargetOriginId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        TrustedSigners: {
                          type: "object",
                          additionalProperties: true,
                        },
                        TrustedKeyGroups: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ViewerProtocolPolicy: {
                          type: "object",
                          additionalProperties: true,
                        },
                        AllowedMethods: {
                          type: "object",
                          additionalProperties: true,
                        },
                        SmoothStreaming: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Compress: {
                          type: "object",
                          additionalProperties: true,
                        },
                        LambdaFunctionAssociations: {
                          type: "object",
                          additionalProperties: true,
                        },
                        FunctionAssociations: {
                          type: "object",
                          additionalProperties: true,
                        },
                        FieldLevelEncryptionId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        RealtimeLogConfigArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                        CachePolicyId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        OriginRequestPolicyId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ResponseHeadersPolicyId: {
                          type: "object",
                          additionalProperties: true,
                        },
                        GrpcConfig: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ForwardedValues: {
                          type: "object",
                          additionalProperties: true,
                        },
                        MinTTL: {
                          type: "object",
                          additionalProperties: true,
                        },
                        DefaultTTL: {
                          type: "object",
                          additionalProperties: true,
                        },
                        MaxTTL: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: [
                        "PathPattern",
                        "TargetOriginId",
                        "ViewerProtocolPolicy",
                      ],
                      additionalProperties: false,
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
                      properties: {
                        ErrorCode: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ResponsePagePath: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ResponseCode: {
                          type: "object",
                          additionalProperties: true,
                        },
                        ErrorCachingMinTTL: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["ErrorCode"],
                      additionalProperties: false,
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
                        type: "string",
                      },
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
                      properties: {
                        Name: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Definition: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Name", "Definition"],
                      additionalProperties: false,
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
            description: "The distribution's configuration information.",
          },
          ETag: {
            type: "string",
            description: "The current version of the configuration.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getDistributionConfig;
