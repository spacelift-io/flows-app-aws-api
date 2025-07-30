import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  AssociateVPCWithHostedZoneCommand,
} from "@aws-sdk/client-route-53";

const associateVPCWithHostedZone: AppBlock = {
  name: "Associate VPC With Hosted Zone",
  description: "Associates an Amazon VPC with a private hosted zone.",
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
            "The ID of the private hosted zone that you want to associate an Amazon VPC with.",
          type: "string",
          required: true,
        },
        VPC: {
          name: "VPC",
          description:
            "A complex type that contains information about the VPC that you want to associate with a private hosted zone.",
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
          description: "Optional: A comment about the association request.",
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

        const command = new AssociateVPCWithHostedZoneCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate VPC With Hosted Zone Result",
      description: "Result from AssociateVPCWithHostedZone operation",
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
              "A complex type that describes the changes made to your hosted zone.",
          },
        },
        required: ["ChangeInfo"],
      },
    },
  },
};

export default associateVPCWithHostedZone;
