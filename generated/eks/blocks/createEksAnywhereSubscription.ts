import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EKSClient,
  CreateEksAnywhereSubscriptionCommand,
} from "@aws-sdk/client-eks";

const createEksAnywhereSubscription: AppBlock = {
  name: "Create Eks Anywhere Subscription",
  description: "Creates an EKS Anywhere subscription.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        name: {
          name: "name",
          description: "The unique name for your subscription.",
          type: "string",
          required: true,
        },
        term: {
          name: "term",
          description:
            "An object representing the term duration and term unit type of your subscription.",
          type: {
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
          required: true,
        },
        licenseQuantity: {
          name: "license Quantity",
          description:
            "The number of licenses to purchase with the subscription.",
          type: "number",
          required: false,
        },
        licenseType: {
          name: "license Type",
          description: "The license type for all licenses in the subscription.",
          type: "string",
          required: false,
        },
        autoRenew: {
          name: "auto Renew",
          description:
            "A boolean indicating whether the subscription auto renews at the end of the term.",
          type: "boolean",
          required: false,
        },
        clientRequestToken: {
          name: "client Request Token",
          description:
            "A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        tags: {
          name: "tags",
          description:
            "The metadata for a subscription to assist with categorization and organization.",
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

        const client = new EKSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new CreateEksAnywhereSubscriptionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Eks Anywhere Subscription Result",
      description: "Result from CreateEksAnywhereSubscription operation",
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
            description: "The full description of the subscription.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createEksAnywhereSubscription;
