import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  DisassociateVPCFromHostedZoneCommand,
} from "@aws-sdk/client-route-53";

const disassociateVPCFromHostedZone: AppBlock = {
  name: "Disassociate VPC From Hosted Zone",
  description:
    "Disassociates an Amazon Virtual Private Cloud (Amazon VPC) from an Amazon Route 53 private hosted zone.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HostedZoneId: {
          name: "Hosted Zone Id",
          description:
            "The ID of the private hosted zone that you want to disassociate a VPC from.",
          type: "string",
          required: true,
        },
        VPC: {
          name: "VPC",
          description:
            "A complex type that contains information about the VPC that you're disassociating from the specified hosted zone.",
          type: {
            type: "object",
            properties: {
              VPCRegion: {
                type: "string",
              },
              VPCId: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: true,
        },
        Comment: {
          name: "Comment",
          description: "Optional: A comment about the disassociation request.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new Route53Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DisassociateVPCFromHostedZoneCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate VPC From Hosted Zone Result",
      description: "Result from DisassociateVPCFromHostedZone operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeInfo: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              SubmittedAt: {
                type: "string",
              },
              Comment: {
                type: "string",
              },
            },
            required: ["Id", "Status", "SubmittedAt"],
            additionalProperties: false,
            description:
              "A complex type that describes the changes made to the specified private hosted zone.",
          },
        },
        required: ["ChangeInfo"],
      },
    },
  },
};

export default disassociateVPCFromHostedZone;
