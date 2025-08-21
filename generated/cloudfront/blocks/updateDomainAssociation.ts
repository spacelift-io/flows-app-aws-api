import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  UpdateDomainAssociationCommand,
} from "@aws-sdk/client-cloudfront";

const updateDomainAssociation: AppBlock = {
  name: "Update Domain Association",
  description:
    "We recommend that you use the UpdateDomainAssociation API operation to move a domain association, as it supports both standard distributions and distribution tenants.",
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
          description: "The domain to update.",
          type: "string",
          required: true,
        },
        TargetResource: {
          name: "Target Resource",
          description:
            "The target standard distribution or distribution tenant resource for the domain.",
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
        IfMatch: {
          name: "If Match",
          description:
            "The value of the ETag identifier for the standard distribution or distribution tenant that will be associated with the domain.",
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

        const command = new UpdateDomainAssociationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Domain Association Result",
      description: "Result from UpdateDomainAssociation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Domain: {
            type: "string",
            description: "The domain that you're moving.",
          },
          ResourceId: {
            type: "string",
            description: "The intended destination for the domain.",
          },
          ETag: {
            type: "string",
            description:
              "The current version of the target standard distribution or distribution tenant that was associated with the domain.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateDomainAssociation;
