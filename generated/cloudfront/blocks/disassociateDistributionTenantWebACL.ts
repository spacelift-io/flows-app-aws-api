import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  DisassociateDistributionTenantWebACLCommand,
} from "@aws-sdk/client-cloudfront";

const disassociateDistributionTenantWebACL: AppBlock = {
  name: "Disassociate Distribution Tenant Web ACL",
  description: "Disassociates a distribution tenant from the WAF web ACL.",
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
        IfMatch: {
          name: "If Match",
          description:
            "The current version of the distribution tenant that you're disassociating from the WAF web ACL.",
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
        });

        const command = new DisassociateDistributionTenantWebACLCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate Distribution Tenant Web ACL Result",
      description: "Result from DisassociateDistributionTenantWebACL operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Id: {
            type: "string",
            description: "The ID of the distribution tenant.",
          },
          ETag: {
            type: "string",
            description: "The current version of the distribution tenant.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disassociateDistributionTenantWebACL;
