import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, AssociateTrunkInterfaceCommand } from "@aws-sdk/client-ec2";

const associateTrunkInterface: AppBlock = {
  name: "Associate Trunk Interface",
  description:
    "Associates a branch network interface with a trunk network interface.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        BranchInterfaceId: {
          name: "Branch Interface Id",
          description: "The ID of the branch network interface.",
          type: "string",
          required: true,
        },
        TrunkInterfaceId: {
          name: "Trunk Interface Id",
          description: "The ID of the trunk network interface.",
          type: "string",
          required: true,
        },
        VlanId: {
          name: "Vlan Id",
          description: "The ID of the VLAN.",
          type: "number",
          required: false,
        },
        GreKey: {
          name: "Gre Key",
          description: "The application key.",
          type: "number",
          required: false,
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

        const command = new AssociateTrunkInterfaceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Trunk Interface Result",
      description: "Result from AssociateTrunkInterface operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InterfaceAssociation: {
            type: "object",
            properties: {
              AssociationId: {
                type: "string",
              },
              BranchInterfaceId: {
                type: "string",
              },
              TrunkInterfaceId: {
                type: "string",
              },
              InterfaceProtocol: {
                type: "string",
              },
              VlanId: {
                type: "number",
              },
              GreKey: {
                type: "number",
              },
              Tags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Key: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "Information about the association between the trunk network interface and branch network interface.",
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

export default associateTrunkInterface;
