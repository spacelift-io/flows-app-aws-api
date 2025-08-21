import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  DeleteVPCAssociationAuthorizationCommand,
} from "@aws-sdk/client-route-53";

const deleteVPCAssociationAuthorization: AppBlock = {
  name: "Delete VPC Association Authorization",
  description:
    "Removes authorization to submit an AssociateVPCWithHostedZone request to associate a specified VPC with a hosted zone that was created by a different account.",
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
            "When removing authorization to associate a VPC that was created by one Amazon Web Services account with a hosted zone that was created with a different Amazon Web Services account, the ID of the hosted zone.",
          type: "string",
          required: true,
        },
        VPC: {
          name: "VPC",
          description:
            "When removing authorization to associate a VPC that was created by one Amazon Web Services account with a hosted zone that was created with a different Amazon Web Services account, a complex type that includes the ID and region of the VPC.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeleteVPCAssociationAuthorizationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete VPC Association Authorization Result",
      description: "Result from DeleteVPCAssociationAuthorization operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteVPCAssociationAuthorization;
