import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateDistributionTenantCommand,
} from "@aws-sdk/client-cloudfront";

const updateDistributionTenant: AppBlock = {
  name: "Update Distribution Tenant",
  description: "Updates a distribution tenant.",
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
          description: "The ID of the distribution tenant.",
          type: "string",
          required: true,
        },
        DistributionId: {
          name: "Distribution Id",
          description: "The ID for the multi-tenant distribution.",
          type: "string",
          required: false,
        },
        Domains: {
          name: "Domains",
          description: "The domains to update for the distribution tenant.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Domain: {
                  type: "string",
                },
              },
              required: ["Domain"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        Customizations: {
          name: "Customizations",
          description: "Customizations for the distribution tenant.",
          type: {
            type: "object",
            properties: {
              WebAcl: {
                type: "object",
                properties: {
                  Action: {
                    type: "string",
                  },
                  Arn: {
                    type: "string",
                  },
                },
                required: ["Action"],
                additionalProperties: false,
              },
              Certificate: {
                type: "object",
                properties: {
                  Arn: {
                    type: "string",
                  },
                },
                required: ["Arn"],
                additionalProperties: false,
              },
              GeoRestrictions: {
                type: "object",
                properties: {
                  RestrictionType: {
                    type: "string",
                  },
                  Locations: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
                required: ["RestrictionType"],
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        Parameters: {
          name: "Parameters",
          description: "A list of parameter values to add to the resource.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Name", "Value"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        ConnectionGroupId: {
          name: "Connection Group Id",
          description: "The ID of the target connection group.",
          type: "string",
          required: false,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The value of the ETag header that you received when retrieving the distribution tenant to update.",
          type: "string",
          required: true,
        },
        ManagedCertificateRequest: {
          name: "Managed Certificate Request",
          description:
            "An object that contains the CloudFront managed ACM certificate request.",
          type: {
            type: "object",
            properties: {
              ValidationTokenHost: {
                type: "string",
              },
              PrimaryDomainName: {
                type: "string",
              },
              CertificateTransparencyLoggingPreference: {
                type: "string",
              },
            },
            required: ["ValidationTokenHost"],
            additionalProperties: false,
          },
          required: false,
        },
        Enabled: {
          name: "Enabled",
          description:
            "Indicates whether the distribution tenant should be updated to an enabled state.",
          type: "boolean",
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

        const command = new UpdateDistributionTenantCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Distribution Tenant Result",
      description: "Result from UpdateDistributionTenant operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DistributionTenant: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              DistributionId: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              Arn: {
                type: "string",
              },
              Domains: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Domain: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  required: ["Domain"],
                  additionalProperties: false,
                },
              },
              Tags: {
                type: "object",
                properties: {
                  Items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        Key: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Value: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["Key"],
                      additionalProperties: false,
                    },
                  },
                },
                additionalProperties: false,
              },
              Customizations: {
                type: "object",
                properties: {
                  WebAcl: {
                    type: "object",
                    properties: {
                      Action: {
                        type: "string",
                      },
                      Arn: {
                        type: "string",
                      },
                    },
                    required: ["Action"],
                    additionalProperties: false,
                  },
                  Certificate: {
                    type: "object",
                    properties: {
                      Arn: {
                        type: "string",
                      },
                    },
                    required: ["Arn"],
                    additionalProperties: false,
                  },
                  GeoRestrictions: {
                    type: "object",
                    properties: {
                      RestrictionType: {
                        type: "string",
                      },
                      Locations: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    required: ["RestrictionType"],
                    additionalProperties: false,
                  },
                },
                additionalProperties: false,
              },
              Parameters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Name: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  required: ["Name", "Value"],
                  additionalProperties: false,
                },
              },
              ConnectionGroupId: {
                type: "string",
              },
              CreatedTime: {
                type: "string",
              },
              LastModifiedTime: {
                type: "string",
              },
              Enabled: {
                type: "boolean",
              },
              Status: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The distribution tenant that you're updating.",
          },
          ETag: {
            type: "string",
            description: "The current version of the distribution tenant.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateDistributionTenant;
