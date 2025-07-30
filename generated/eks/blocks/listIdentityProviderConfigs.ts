import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EKSClient,
  ListIdentityProviderConfigsCommand,
} from "@aws-sdk/client-eks";

const listIdentityProviderConfigs: AppBlock = {
  name: "List Identity Provider Configs",
  description: "Lists the identity provider configurations for your cluster.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        clusterName: {
          name: "cluster Name",
          description: "The name of your cluster.",
          type: "string",
          required: true,
        },
        maxResults: {
          name: "max Results",
          description:
            "The maximum number of results, returned in paginated output.",
          type: "number",
          required: false,
        },
        nextToken: {
          name: "next Token",
          description:
            "The nextToken value returned from a previous paginated request, where maxResults was used and the results exceeded the value of that parameter.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EKSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListIdentityProviderConfigsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Identity Provider Configs Result",
      description: "Result from ListIdentityProviderConfigs operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          identityProviderConfigs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
              },
              required: ["type", "name"],
              additionalProperties: false,
            },
            description:
              "The identity provider configurations for the cluster.",
          },
          nextToken: {
            type: "string",
            description:
              "The nextToken value to include in a future ListIdentityProviderConfigsResponse request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listIdentityProviderConfigs;
