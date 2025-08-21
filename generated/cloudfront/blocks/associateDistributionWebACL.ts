import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  AssociateDistributionWebACLCommand,
} from "@aws-sdk/client-cloudfront";

const associateDistributionWebACL: AppBlock = {
  name: "Associate Distribution Web ACL",
  description: "Associates the WAF web ACL with a distribution.",
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
        WebACLArn: {
          name: "Web ACL Arn",
          description:
            "The Amazon Resource Name (ARN) of the WAF web ACL to associate.",
          type: "string",
          required: true,
        },
        IfMatch: {
          name: "If Match",
          description:
            "The value of the ETag header that you received when retrieving the distribution that you're associating with the WAF web ACL.",
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

        const command = new AssociateDistributionWebACLCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Distribution Web ACL Result",
      description: "Result from AssociateDistributionWebACL operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Id: {
            type: "string",
            description: "The ID of the distribution.",
          },
          WebACLArn: {
            type: "string",
            description:
              "The ARN of the WAF web ACL that you associated with the distribution.",
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

export default associateDistributionWebACL;
