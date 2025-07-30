import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateContinuousDeploymentPolicyCommand,
} from "@aws-sdk/client-cloudfront";

const updateContinuousDeploymentPolicy: AppBlock = {
  name: "Update Continuous Deployment Policy",
  description: "Updates a continuous deployment policy.",
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
          description: "The continuous deployment policy configuration.",
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
        Id: {
          name: "Id",
          description:
            "The identifier of the continuous deployment policy that you are updating.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The current version (ETag value) of the continuous deployment policy that you are updating.",
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
        });

        const command = new UpdateContinuousDeploymentPolicyCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Continuous Deployment Policy Result",
      description: "Result from UpdateContinuousDeploymentPolicy operation",
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

export default updateContinuousDeploymentPolicy;
