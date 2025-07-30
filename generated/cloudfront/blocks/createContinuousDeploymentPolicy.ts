import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreateContinuousDeploymentPolicyCommand,
} from "@aws-sdk/client-cloudfront";

const createContinuousDeploymentPolicy: AppBlock = {
  name: "Create Continuous Deployment Policy",
  description:
    "Creates a continuous deployment policy that distributes traffic for a custom domain name to two different CloudFront distributions.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ContinuousDeploymentPolicyConfig: {
          name: "Continuous Deployment Policy Config",
          description:
            "Contains the configuration for a continuous deployment policy.",
          type: {
            type: "object",
            properties: {
              StagingDistributionDnsNames: {
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
              Enabled: {
                type: "boolean",
              },
              TrafficConfig: {
                type: "object",
                properties: {
                  SingleWeightConfig: {
                    type: "object",
                    properties: {
                      Weight: {
                        type: "number",
                      },
                      SessionStickinessConfig: {
                        type: "object",
                        properties: {
                          IdleTTL: {
                            type: "object",
                            additionalProperties: true,
                          },
                          MaximumTTL: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["IdleTTL", "MaximumTTL"],
                        additionalProperties: false,
                      },
                    },
                    required: ["Weight"],
                    additionalProperties: false,
                  },
                  SingleHeaderConfig: {
                    type: "object",
                    properties: {
                      Header: {
                        type: "string",
                      },
                      Value: {
                        type: "string",
                      },
                    },
                    required: ["Header", "Value"],
                    additionalProperties: false,
                  },
                  Type: {
                    type: "string",
                  },
                },
                required: ["Type"],
                additionalProperties: false,
              },
            },
            required: ["StagingDistributionDnsNames", "Enabled"],
            additionalProperties: false,
          },
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

        const command = new CreateContinuousDeploymentPolicyCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Continuous Deployment Policy Result",
      description: "Result from CreateContinuousDeploymentPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ContinuousDeploymentPolicy: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              LastModifiedTime: {
                type: "string",
              },
              ContinuousDeploymentPolicyConfig: {
                type: "object",
                properties: {
                  StagingDistributionDnsNames: {
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
                  Enabled: {
                    type: "boolean",
                  },
                  TrafficConfig: {
                    type: "object",
                    properties: {
                      SingleWeightConfig: {
                        type: "object",
                        properties: {
                          Weight: {
                            type: "object",
                            additionalProperties: true,
                          },
                          SessionStickinessConfig: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["Weight"],
                        additionalProperties: false,
                      },
                      SingleHeaderConfig: {
                        type: "object",
                        properties: {
                          Header: {
                            type: "object",
                            additionalProperties: true,
                          },
                          Value: {
                            type: "object",
                            additionalProperties: true,
                          },
                        },
                        required: ["Header", "Value"],
                        additionalProperties: false,
                      },
                      Type: {
                        type: "string",
                      },
                    },
                    required: ["Type"],
                    additionalProperties: false,
                  },
                },
                required: ["StagingDistributionDnsNames", "Enabled"],
                additionalProperties: false,
              },
            },
            required: [
              "Id",
              "LastModifiedTime",
              "ContinuousDeploymentPolicyConfig",
            ],
            additionalProperties: false,
            description: "A continuous deployment policy.",
          },
          Location: {
            type: "string",
            description: "The location of the continuous deployment policy.",
          },
          ETag: {
            type: "string",
            description:
              "The version identifier for the current version of the continuous deployment policy.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createContinuousDeploymentPolicy;
