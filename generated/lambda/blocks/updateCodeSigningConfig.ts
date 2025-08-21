import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  UpdateCodeSigningConfigCommand,
} from "@aws-sdk/client-lambda";

const updateCodeSigningConfig: AppBlock = {
  name: "Update Code Signing Config",
  description: "Update the code signing configuration.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CodeSigningConfigArn: {
          name: "Code Signing Config Arn",
          description:
            "The The Amazon Resource Name (ARN) of the code signing configuration.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "Descriptive name for this code signing configuration.",
          type: "string",
          required: false,
        },
        AllowedPublishers: {
          name: "Allowed Publishers",
          description: "Signing profiles for this code signing configuration.",
          type: {
            type: "object",
            properties: {
              SigningProfileVersionArns: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["SigningProfileVersionArns"],
            additionalProperties: false,
          },
          required: false,
        },
        CodeSigningPolicies: {
          name: "Code Signing Policies",
          description: "The code signing policy.",
          type: {
            type: "object",
            properties: {
              UntrustedArtifactOnDeployment: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
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

        const command = new UpdateCodeSigningConfigCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Code Signing Config Result",
      description: "Result from UpdateCodeSigningConfig operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CodeSigningConfig: {
            type: "object",
            properties: {
              CodeSigningConfigId: {
                type: "string",
              },
              CodeSigningConfigArn: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              AllowedPublishers: {
                type: "object",
                properties: {
                  SigningProfileVersionArns: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
                required: ["SigningProfileVersionArns"],
                additionalProperties: false,
              },
              CodeSigningPolicies: {
                type: "object",
                properties: {
                  UntrustedArtifactOnDeployment: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              LastModified: {
                type: "string",
              },
            },
            required: [
              "CodeSigningConfigId",
              "CodeSigningConfigArn",
              "AllowedPublishers",
              "CodeSigningPolicies",
              "LastModified",
            ],
            additionalProperties: false,
            description: "The code signing configuration",
          },
        },
        required: ["CodeSigningConfig"],
      },
    },
  },
};

export default updateCodeSigningConfig;
