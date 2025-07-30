import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, ListRetirableGrantsCommand } from "@aws-sdk/client-kms";

const listRetirableGrants: AppBlock = {
  name: "List Retirable Grants",
  description:
    "Returns information about all grants in the Amazon Web Services account and Region that have the specified retiring principal.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
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
        RetiringPrincipal: {
          name: "Retiring Principal",
          description: "The retiring principal for which to list grants.",
          type: "string",
          required: true,
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

        const command = new ListRetirableGrantsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Retirable Grants Result",
      description: "Result from ListRetirableGrants operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Grants: {
            type: "array",
            items: {
              type: "object",
              properties: {
                KeyId: {
                  type: "string",
                },
                GrantId: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                CreationDate: {
                  type: "string",
                },
                GranteePrincipal: {
                  type: "string",
                },
                RetiringPrincipal: {
                  type: "string",
                },
                IssuingAccount: {
                  type: "string",
                },
                Operations: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                Constraints: {
                  type: "object",
                  properties: {
                    EncryptionContextSubset: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                    EncryptionContextEquals: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description: "A list of grants.",
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

export default listRetirableGrants;
