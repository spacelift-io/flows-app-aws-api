import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListDomainConflictsCommand,
} from "@aws-sdk/client-cloudfront";

const listDomainConflicts: AppBlock = {
  name: "List Domain Conflicts",
  description:
    "We recommend that you use the ListDomainConflicts API operation to check for domain conflicts, as it supports both standard distributions and distribution tenants.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Domain: {
          name: "Domain",
          description: "The domain to check for conflicts.",
          type: "string",
          required: true,
        },
        DomainControlValidationResource: {
          name: "Domain Control Validation Resource",
          description: "The distribution resource identifier.",
          type: {
            type: "object",
            properties: {
              DistributionId: {
                type: "string",
              },
              DistributionTenantId: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: true,
        },
        MaxItems: {
          name: "Max Items",
          description: "The maximum number of domain conflicts to return.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description: "The marker for the next set of domain conflicts.",
          type: "string",
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

        const command = new ListDomainConflictsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Domain Conflicts Result",
      description: "Result from ListDomainConflicts operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DomainConflicts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Domain: {
                  type: "string",
                },
                ResourceType: {
                  type: "string",
                },
                ResourceId: {
                  type: "string",
                },
                AccountId: {
                  type: "string",
                },
              },
              required: ["Domain", "ResourceType", "ResourceId", "AccountId"],
              additionalProperties: false,
            },
            description: "Contains details about the domain conflicts.",
          },
          NextMarker: {
            type: "string",
            description:
              "A token used for pagination of results returned in the response.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listDomainConflicts;
