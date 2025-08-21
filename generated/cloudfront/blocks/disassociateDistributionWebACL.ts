import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  DisassociateDistributionWebACLCommand,
} from "@aws-sdk/client-cloudfront";

const disassociateDistributionWebACL: AppBlock = {
  name: "Disassociate Distribution Web ACL",
  description: "Disassociates a distribution from the WAF web ACL.",
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
          description: "The ID of the distribution.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The value of the ETag header that you received when retrieving the distribution that you're disassociating from the WAF web ACL.",
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

        const command = new DisassociateDistributionWebACLCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate Distribution Web ACL Result",
      description: "Result from DisassociateDistributionWebACL operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Id: {
            type: "string",
            description: "The ID of the distribution.",
          },
          ETag: {
            type: "string",
            description: "The current version of the distribution.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disassociateDistributionWebACL;
