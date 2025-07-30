import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  CreateVPCAssociationAuthorizationCommand,
} from "@aws-sdk/client-route-53";

const createVPCAssociationAuthorization: AppBlock = {
  name: "Create VPC Association Authorization",
  description:
    "Authorizes the Amazon Web Services account that created a specified VPC to submit an AssociateVPCWithHostedZone request to associate the VPC with a specified hosted zone that was created by a different account.",
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
            "The ID of the private hosted zone that you want to authorize associating a VPC with.",
          type: "string",
          required: true,
        },
        VPC: {
          name: "VPC",
          description:
            "A complex type that contains the VPC ID and region for the VPC that you want to authorize associating with your hosted zone.",
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

        const command = new CreateVPCAssociationAuthorizationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create VPC Association Authorization Result",
      description: "Result from CreateVPCAssociationAuthorization operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          HostedZoneId: {
            type: "string",
            description:
              "The ID of the hosted zone that you authorized associating a VPC with.",
          },
          VPC: {
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
            description:
              "The VPC that you authorized associating with a hosted zone.",
          },
        },
        required: ["HostedZoneId", "VPC"],
      },
    },
  },
};

export default createVPCAssociationAuthorization;
