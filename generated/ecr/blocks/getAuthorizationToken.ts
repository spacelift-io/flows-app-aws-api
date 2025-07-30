import { AppBlock, events } from "@slflows/sdk/v1";
import { ECRClient, GetAuthorizationTokenCommand } from "@aws-sdk/client-ecr";

const getAuthorizationToken: AppBlock = {
  name: "Get Authorization Token",
  description: "Retrieves an authorization token.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        registryIds: {
          name: "registry Ids",
          description:
            "A list of Amazon Web Services account IDs that are associated with the registries for which to get AuthorizationData objects.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new ECRClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetAuthorizationTokenCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Authorization Token Result",
      description: "Result from GetAuthorizationToken operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          authorizationData: {
            type: "array",
            items: {
              type: "object",
              properties: {
                authorizationToken: {
                  type: "string",
                },
                expiresAt: {
                  type: "string",
                },
                proxyEndpoint: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of authorization token data objects that correspond to the registryIds values in the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getAuthorizationToken;
