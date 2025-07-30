import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifyIdentityIdFormatCommand } from "@aws-sdk/client-ec2";

const modifyIdentityIdFormat: AppBlock = {
  name: "Modify Identity Id Format",
  description:
    "Modifies the ID format of a resource for a specified IAM user, IAM role, or the root user for an account; or all IAM users, IAM roles, and the root user for an account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Resource: {
          name: "Resource",
          description:
            "The type of resource: bundle | conversion-task | customer-gateway | dhcp-options | elastic-ip-allocation | elastic-ip-association | export-task | flow-log | image | import-task | internet-gateway | network-acl | network-acl-association | network-interface | network-interface-attachment | prefix-list | route-table | route-table-association | security-group | subnet | subnet-cidr-block-association | vpc | vpc-cidr-block-association | vpc-endpoint | vpc-peering-connection | vpn-connection | vpn-gateway.",
          type: "string",
          required: true,
        },
        UseLongIds: {
          name: "Use Long Ids",
          description:
            "Indicates whether the resource should use longer IDs (17-character IDs)",
          type: "boolean",
          required: true,
        },
        PrincipalArn: {
          name: "Principal Arn",
          description:
            "The ARN of the principal, which can be an IAM user, IAM role, or the root user.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ModifyIdentityIdFormatCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Identity Id Format Result",
      description: "Result from ModifyIdentityIdFormat operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default modifyIdentityIdFormat;
