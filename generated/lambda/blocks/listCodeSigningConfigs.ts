import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  ListCodeSigningConfigsCommand,
} from "@aws-sdk/client-lambda";

const listCodeSigningConfigs: AppBlock = {
  name: "List Code Signing Configs",
  description: "Returns a list of code signing configurations.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Marker: {
          name: "Marker",
          description:
            "Specify the pagination token that's returned by a previous request to retrieve the next page of results.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description: "Maximum number of items to return.",
          type: "number",
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
        });

        const command = new ListCodeSigningConfigsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Code Signing Configs Result",
      description: "Result from ListCodeSigningConfigs operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextMarker: {
            type: "string",
            description:
              "The pagination token that's included if more results are available.",
          },
          CodeSigningConfigs: {
            type: "array",
            items: {
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
                        type: "object",
                        additionalProperties: true,
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
            },
            description: "The code signing configurations",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listCodeSigningConfigs;
