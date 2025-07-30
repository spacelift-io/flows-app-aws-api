import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreateDistributionTenantCommand,
} from "@aws-sdk/client-cloudfront";

const createDistributionTenant: AppBlock = {
  name: "Create Distribution Tenant",
  description: "Creates a distribution tenant.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DistributionId: {
          name: "Distribution Id",
          description:
            "The ID of the multi-tenant distribution to use for creating the distribution tenant.",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name of the distribution tenant.",
          type: "string",
          required: true,
        },
        Domains: {
          name: "Domains",
          description: "The domains associated with the distribution tenant.",
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
          required: true,
        },
        Tags: {
          name: "Tags",
          description:
            "A complex type that contains zero or more Tag elements.",
          type: {
            type: "object",
            properties: {
              Items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  required: ["Key"],
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
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
          description:
            "The ID of the connection group to associate with the distribution tenant.",
          type: "string",
          required: false,
        },
        ManagedCertificateRequest: {
          name: "Managed Certificate Request",
          description:
            "The configuration for the CloudFront managed ACM certificate request.",
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
            "Indicates whether the distribution tenant should be enabled when created.",
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
        });

        const command = new CreateDistributionTenantCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Distribution Tenant Result",
      description: "Result from CreateDistributionTenant operation",
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
            description: "The distribution tenant that you created.",
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

export default createDistributionTenant;
