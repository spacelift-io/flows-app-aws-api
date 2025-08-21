import { AppBlock, events } from "@slflows/sdk/v1";
import { KMSClient, CreateGrantCommand } from "@aws-sdk/client-kms";

const createGrant: AppBlock = {
  name: "Create Grant",
  description: "Adds a grant to a KMS key.",
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
          description: "Identifies the KMS key for the grant.",
          type: "string",
          required: true,
        },
        GranteePrincipal: {
          name: "Grantee Principal",
          description:
            "The identity that gets the permissions specified in the grant.",
          type: "string",
          required: true,
        },
        RetiringPrincipal: {
          name: "Retiring Principal",
          description:
            "The principal that has permission to use the RetireGrant operation to retire the grant.",
          type: "string",
          required: false,
        },
        Operations: {
          name: "Operations",
          description: "A list of operations that the grant permits.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
        Constraints: {
          name: "Constraints",
          description: "Specifies a grant constraint.",
          type: {
            type: "object",
            properties: {
              EncryptionContextSubset: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
              EncryptionContextEquals: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        GrantTokens: {
          name: "Grant Tokens",
          description: "A list of grant tokens.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Name: {
          name: "Name",
          description: "A friendly name for the grant.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description: "Checks if your request will succeed.",
          type: "boolean",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateGrantCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Grant Result",
      description: "Result from CreateGrant operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          GrantToken: {
            type: "string",
            description: "The grant token.",
          },
          GrantId: {
            type: "string",
            description: "The unique identifier for the grant.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createGrant;
