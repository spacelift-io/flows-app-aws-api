import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  GetOpenIDConnectProviderCommand,
} from "@aws-sdk/client-iam";

const getOpenIDConnectProvider: AppBlock = {
  name: "Get Open ID Connect Provider",
  description:
    "Returns information about the specified OpenID Connect (OIDC) provider resource object in IAM.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OpenIDConnectProviderArn: {
          name: "Open ID Connect Provider Arn",
          description:
            "The Amazon Resource Name (ARN) of the OIDC provider resource object in IAM to get information for.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetOpenIDConnectProviderCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Open ID Connect Provider Result",
      description: "Result from GetOpenIDConnectProvider operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Url: {
            type: "string",
            description:
              "The URL that the IAM OIDC provider resource object is associated with.",
          },
          ClientIDList: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of client IDs (also known as audiences) that are associated with the specified IAM OIDC provider resource object.",
          },
          ThumbprintList: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of certificate thumbprints that are associated with the specified IAM OIDC provider resource object.",
          },
          CreateDate: {
            type: "string",
            description:
              "The date and time when the IAM OIDC provider resource object was created in the Amazon Web Services account.",
          },
          Tags: {
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
              required: ["Key", "Value"],
              additionalProperties: false,
            },
            description:
              "A list of tags that are attached to the specified IAM OIDC provider.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getOpenIDConnectProvider;
