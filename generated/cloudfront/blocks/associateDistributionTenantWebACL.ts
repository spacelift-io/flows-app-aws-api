import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  AssociateDistributionTenantWebACLCommand,
} from "@aws-sdk/client-cloudfront";

const associateDistributionTenantWebACL: AppBlock = {
  name: "Associate Distribution Tenant Web ACL",
  description: "Associates the WAF web ACL with a distribution tenant.",
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
        WebACLArn: {
          name: "Web ACL Arn",
          description:
            "The Amazon Resource Name (ARN) of the WAF web ACL to associate.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description: "The current ETag of the distribution tenant.",
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

        const command = new AssociateDistributionTenantWebACLCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Distribution Tenant Web ACL Result",
      description: "Result from AssociateDistributionTenantWebACL operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Id: {
            type: "string",
            description: "The ID of the distribution tenant.",
          },
          WebACLArn: {
            type: "string",
            description:
              "The ARN of the WAF web ACL that you associated with the distribution tenant.",
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

export default associateDistributionTenantWebACL;
