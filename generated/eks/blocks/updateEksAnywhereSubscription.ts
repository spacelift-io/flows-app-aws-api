import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EKSClient,
  UpdateEksAnywhereSubscriptionCommand,
} from "@aws-sdk/client-eks";

const updateEksAnywhereSubscription: AppBlock = {
  name: "Update Eks Anywhere Subscription",
  description: "Update an EKS Anywhere Subscription.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        id: {
          name: "id",
          description: "The ID of the subscription.",
          type: "string",
          required: true,
        },
        autoRenew: {
          name: "auto Renew",
          description:
            "A boolean indicating whether or not to automatically renew the subscription.",
          type: "boolean",
          required: true,
        },
        clientRequestToken: {
          name: "client Request Token",
          description:
            "Unique, case-sensitive identifier to ensure the idempotency of the request.",
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

        const command = new UpdateEksAnywhereSubscriptionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Eks Anywhere Subscription Result",
      description: "Result from UpdateEksAnywhereSubscription operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          subscription: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              arn: {
                type: "string",
              },
              createdAt: {
                type: "string",
              },
              effectiveDate: {
                type: "string",
              },
              expirationDate: {
                type: "string",
              },
              licenseQuantity: {
                type: "number",
              },
              licenseType: {
                type: "string",
              },
              term: {
                type: "object",
                properties: {
                  duration: {
                    type: "number",
                  },
                  unit: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
              status: {
                type: "string",
              },
              autoRenew: {
                type: "boolean",
              },
              licenseArns: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              licenses: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    token: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              tags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
            description: "The full description of the updated subscription.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateEksAnywhereSubscription;
