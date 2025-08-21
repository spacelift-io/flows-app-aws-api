import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetContinuousDeploymentPolicyCommand,
} from "@aws-sdk/client-cloudfront";

const getContinuousDeploymentPolicy: AppBlock = {
  name: "Get Continuous Deployment Policy",
  description:
    "Gets a continuous deployment policy, including metadata (the policy's identifier and the date and time when the policy was last modified).",
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
            "The identifier of the continuous deployment policy that you are getting.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetContinuousDeploymentPolicyCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Continuous Deployment Policy Result",
      description: "Result from GetContinuousDeploymentPolicy operation",
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

export default getContinuousDeploymentPolicy;
