import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ReplaceNetworkAclAssociationCommand,
} from "@aws-sdk/client-ec2";

const replaceNetworkAclAssociation: AppBlock = {
  name: "Replace Network Acl Association",
  description: "Changes which network ACL a subnet is associated with.",
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
        AssociationId: {
          name: "Association Id",
          description:
            "The ID of the current association between the original network ACL and the subnet.",
          type: "string",
          required: true,
        },
        NetworkAclId: {
          name: "Network Acl Id",
          description:
            "The ID of the new network ACL to associate with the subnet.",
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

        const command = new ReplaceNetworkAclAssociationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Replace Network Acl Association Result",
      description: "Result from ReplaceNetworkAclAssociation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NewAssociationId: {
            type: "string",
            description: "The ID of the new association.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default replaceNetworkAclAssociation;
