import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, ListAliasesCommand } from "@aws-sdk/client-kms";

const listAliases: AppBlock = {
  name: "List Aliases",
  description:
    "Gets a list of aliases in the caller's Amazon Web Services account and region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        KeyId: {
          name: "Key Id",
          description:
            "Lists only aliases that are associated with the specified KMS key.",
          type: "string",
          required: false,
        },
        Limit: {
          name: "Limit",
          description:
            "Use this parameter to specify the maximum number of items to return.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this parameter in a subsequent request after you receive a response with truncated results.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new KMSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListAliasesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Aliases Result",
      description: "Result from ListAliases operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Aliases: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AliasName: {
                  type: "string",
                },
                AliasArn: {
                  type: "string",
                },
                TargetKeyId: {
                  type: "string",
                },
                CreationDate: {
                  type: "string",
                },
                LastUpdatedDate: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of aliases.",
          },
          NextMarker: {
            type: "string",
            description:
              "When Truncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent request.",
          },
          Truncated: {
            type: "boolean",
            description:
              "A flag that indicates whether there are more items in the list.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listAliases;
