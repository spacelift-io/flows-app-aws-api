import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DisassociateTrunkInterfaceCommand,
} from "@aws-sdk/client-ec2";

const disassociateTrunkInterface: AppBlock = {
  name: "Disassociate Trunk Interface",
  description:
    "Removes an association between a branch network interface with a trunk network interface.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AssociationId: {
          name: "Association Id",
          description: "The ID of the association",
          type: "string",
          required: true,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
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

        const command = new DisassociateTrunkInterfaceCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate Trunk Interface Result",
      description: "Result from DisassociateTrunkInterface operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Returns true if the request succeeds; otherwise, it returns an error.",
          },
          ClientToken: {
            type: "string",
            description:
              "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disassociateTrunkInterface;
