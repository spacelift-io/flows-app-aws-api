import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetContinuousDeploymentPolicyConfigCommand,
} from "@aws-sdk/client-cloudfront";

const getContinuousDeploymentPolicyConfig: AppBlock = {
  name: "Get Continuous Deployment Policy Config",
  description:
    "Gets configuration information about a continuous deployment policy.",
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
            "The identifier of the continuous deployment policy whose configuration you are getting.",
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

        const command = new GetContinuousDeploymentPolicyConfigCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Continuous Deployment Policy Config Result",
      description: "Result from GetContinuousDeploymentPolicyConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
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
            description:
              "Contains the configuration for a continuous deployment policy.",
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

export default getContinuousDeploymentPolicyConfig;
