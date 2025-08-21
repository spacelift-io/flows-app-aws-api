import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";

const createInvalidation: AppBlock = {
  name: "Create Invalidation",
  description: "Create a new invalidation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DistributionId: {
          name: "Distribution Id",
          description: "The distribution's id.",
          type: "string",
          required: true,
        },
        InvalidationBatch: {
          name: "Invalidation Batch",
          description: "The batch information for the invalidation.",
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

        const command = new CreateInvalidationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Invalidation Result",
      description: "Result from CreateInvalidation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Location: {
            type: "string",
            description:
              "The fully qualified URI of the distribution and invalidation batch request, including the Invalidation ID.",
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
            description: "The invalidation's information.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createInvalidation;
