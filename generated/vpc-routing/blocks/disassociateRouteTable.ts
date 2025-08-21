import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DisassociateRouteTableCommand } from "@aws-sdk/client-ec2";

const disassociateRouteTable: AppBlock = {
  name: "Disassociate Route Table",
  description: "Disassociates a subnet or gateway from a route table.",
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
            "The association ID representing the current association between the route table and subnet or gateway.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DisassociateRouteTableCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate Route Table Result",
      description: "Result from DisassociateRouteTable operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default disassociateRouteTable;
