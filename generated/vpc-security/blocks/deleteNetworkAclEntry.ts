import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DeleteNetworkAclEntryCommand } from "@aws-sdk/client-ec2";

const deleteNetworkAclEntry: AppBlock = {
  name: "Delete Network Acl Entry",
  description:
    "Deletes the specified ingress or egress entry (rule) from the specified network ACL.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        NetworkAclId: {
          name: "Network Acl Id",
          description: "The ID of the network ACL.",
          type: "string",
          required: true,
        },
        RuleNumber: {
          name: "Rule Number",
          description: "The rule number of the entry to delete.",
          type: "number",
          required: true,
        },
        Egress: {
          name: "Egress",
          description: "Indicates whether the rule is an egress rule.",
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
        });

        const command = new DeleteNetworkAclEntryCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Network Acl Entry Result",
      description: "Result from DeleteNetworkAclEntry operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteNetworkAclEntry;
