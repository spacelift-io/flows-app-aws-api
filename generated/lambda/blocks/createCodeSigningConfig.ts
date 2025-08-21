import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  CreateCodeSigningConfigCommand,
} from "@aws-sdk/client-lambda";

const createCodeSigningConfig: AppBlock = {
  name: "Create Code Signing Config",
  description: "Creates a code signing configuration.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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
          required: true,
        },
        CodeSigningPolicies: {
          name: "Code Signing Policies",
          description:
            "The code signing policies define the actions to take if the validation checks fail.",
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
        Tags: {
          name: "Tags",
          description:
            "A list of tags to add to the code signing configuration.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
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

        const command = new CreateCodeSigningConfigCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Code Signing Config Result",
      description: "Result from CreateCodeSigningConfig operation",
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
            description: "The code signing configuration.",
          },
        },
        required: ["CodeSigningConfig"],
      },
    },
  },
};

export default createCodeSigningConfig;
