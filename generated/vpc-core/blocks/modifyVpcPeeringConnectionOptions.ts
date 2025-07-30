import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyVpcPeeringConnectionOptionsCommand,
} from "@aws-sdk/client-ec2";

const modifyVpcPeeringConnectionOptions: AppBlock = {
  name: "Modify Vpc Peering Connection Options",
  description:
    "Modifies the VPC peering connection options on one side of a VPC peering connection.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AccepterPeeringConnectionOptions: {
          name: "Accepter Peering Connection Options",
          description:
            "The VPC peering connection options for the accepter VPC.",
          type: {
            type: "object",
            properties: {
              AllowDnsResolutionFromRemoteVpc: {
                type: "boolean",
              },
              AllowEgressFromLocalClassicLinkToRemoteVpc: {
                type: "boolean",
              },
              AllowEgressFromLocalVpcToRemoteClassicLink: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        RequesterPeeringConnectionOptions: {
          name: "Requester Peering Connection Options",
          description:
            "The VPC peering connection options for the requester VPC.",
          type: {
            type: "object",
            properties: {
              AllowDnsResolutionFromRemoteVpc: {
                type: "boolean",
              },
              AllowEgressFromLocalClassicLinkToRemoteVpc: {
                type: "boolean",
              },
              AllowEgressFromLocalVpcToRemoteClassicLink: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        VpcPeeringConnectionId: {
          name: "Vpc Peering Connection Id",
          description: "The ID of the VPC peering connection.",
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

        const command = new ModifyVpcPeeringConnectionOptionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Vpc Peering Connection Options Result",
      description: "Result from ModifyVpcPeeringConnectionOptions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AccepterPeeringConnectionOptions: {
            type: "object",
            properties: {
              AllowDnsResolutionFromRemoteVpc: {
                type: "boolean",
              },
              AllowEgressFromLocalClassicLinkToRemoteVpc: {
                type: "boolean",
              },
              AllowEgressFromLocalVpcToRemoteClassicLink: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description:
              "Information about the VPC peering connection options for the accepter VPC.",
          },
          RequesterPeeringConnectionOptions: {
            type: "object",
            properties: {
              AllowDnsResolutionFromRemoteVpc: {
                type: "boolean",
              },
              AllowEgressFromLocalClassicLinkToRemoteVpc: {
                type: "boolean",
              },
              AllowEgressFromLocalVpcToRemoteClassicLink: {
                type: "boolean",
              },
            },
            additionalProperties: false,
            description:
              "Information about the VPC peering connection options for the requester VPC.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyVpcPeeringConnectionOptions;
