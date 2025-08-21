import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreateInvalidationForDistributionTenantCommand,
} from "@aws-sdk/client-cloudfront";

const createInvalidationForDistributionTenant: AppBlock = {
  name: "Create Invalidation For Distribution Tenant",
  description: "Creates an invalidation for a distribution tenant.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description: "The ID of the distribution tenant.",
          type: "string",
          required: true,
        },
        InvalidationBatch: {
          name: "Invalidation Batch",
          description: "An invalidation batch.",
          type: {
            type: "object",
            properties: {
              Paths: {
                type: "object",
                properties: {
                  Quantity: {
                    type: "number",
                  },
                  Items: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
                required: ["Quantity"],
                additionalProperties: false,
              },
              CallerReference: {
                type: "string",
              },
            },
            required: ["Paths", "CallerReference"],
            additionalProperties: false,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
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

        const command = new CreateInvalidationForDistributionTenantCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Invalidation For Distribution Tenant Result",
      description:
        "Result from CreateInvalidationForDistributionTenant operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Location: {
            type: "string",
            description: "The location for the invalidation.",
          },
          Invalidation: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              CreateTime: {
                type: "string",
              },
              InvalidationBatch: {
                type: "object",
                properties: {
                  Paths: {
                    type: "object",
                    properties: {
                      Quantity: {
                        type: "number",
                      },
                      Items: {
                        type: "array",
                        items: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                    },
                    required: ["Quantity"],
                    additionalProperties: false,
                  },
                  CallerReference: {
                    type: "string",
                  },
                },
                required: ["Paths", "CallerReference"],
                additionalProperties: false,
              },
            },
            required: ["Id", "Status", "CreateTime", "InvalidationBatch"],
            additionalProperties: false,
            description: "An invalidation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createInvalidationForDistributionTenant;
