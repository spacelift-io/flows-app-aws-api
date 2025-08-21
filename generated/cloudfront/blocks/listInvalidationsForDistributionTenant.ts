import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListInvalidationsForDistributionTenantCommand,
} from "@aws-sdk/client-cloudfront";

const listInvalidationsForDistributionTenant: AppBlock = {
  name: "List Invalidations For Distribution Tenant",
  description: "Lists the invalidations for a distribution tenant.",
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
        Marker: {
          name: "Marker",
          description:
            "Use this parameter when paginating results to indicate where to begin in your list of invalidation batches.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of invalidations to return for the distribution tenant.",
          type: "number",
          required: false,
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

        const command = new ListInvalidationsForDistributionTenantCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Invalidations For Distribution Tenant Result",
      description:
        "Result from ListInvalidationsForDistributionTenant operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InvalidationList: {
            type: "object",
            properties: {
              Marker: {
                type: "string",
              },
              NextMarker: {
                type: "string",
              },
              MaxItems: {
                type: "number",
              },
              IsTruncated: {
                type: "boolean",
              },
              Quantity: {
                type: "number",
              },
              Items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Id: {
                      type: "string",
                    },
                    CreateTime: {
                      type: "string",
                    },
                    Status: {
                      type: "string",
                    },
                  },
                  required: ["Id", "CreateTime", "Status"],
                  additionalProperties: false,
                },
              },
            },
            required: ["Marker", "MaxItems", "IsTruncated", "Quantity"],
            additionalProperties: false,
            description:
              "The InvalidationList complex type describes the list of invalidation objects.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listInvalidationsForDistributionTenant;
