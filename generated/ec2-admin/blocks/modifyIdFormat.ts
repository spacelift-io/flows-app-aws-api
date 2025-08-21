import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifyIdFormatCommand } from "@aws-sdk/client-ec2";

const modifyIdFormat: AppBlock = {
  name: "Modify Id Format",
  description:
    "Modifies the ID format for the specified resource on a per-Region basis.",
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
            "Indicate whether the resource should use longer IDs (17-character IDs).",
          type: "boolean",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ModifyIdFormatCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Id Format Result",
      description: "Result from ModifyIdFormat operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default modifyIdFormat;
