import { AppBlock, events } from "@slflows/sdk/v1";
import {
  WAFClient,
  CreateWebACLMigrationStackCommand,
} from "@aws-sdk/client-waf";

const createWebACLMigrationStack: AppBlock = {
  name: "Create Web ACL Migration Stack",
  description:
    "Creates an AWS CloudFormation WAFV2 template for the specified web ACL in the specified Amazon S3 bucket.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        WebACLId: {
          name: "Web ACL Id",
          description:
            "The UUID of the WAF Classic web ACL that you want to migrate to WAF v2.",
          type: "string",
          required: true,
        },
        S3BucketName: {
          name: "S3Bucket Name",
          description:
            "The name of the Amazon S3 bucket to store the CloudFormation template in.",
          type: "string",
          required: true,
        },
        IgnoreUnsupportedType: {
          name: "Ignore Unsupported Type",
          description:
            "Indicates whether to exclude entities that can't be migrated or to stop the migration.",
          type: "boolean",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new WAFClient({
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

        const command = new CreateWebACLMigrationStackCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Web ACL Migration Stack Result",
      description: "Result from CreateWebACLMigrationStack operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          S3ObjectUrl: {
            type: "string",
            description: "The URL of the template created in Amazon S3.",
          },
        },
        required: ["S3ObjectUrl"],
      },
    },
  },
};

export default createWebACLMigrationStack;
