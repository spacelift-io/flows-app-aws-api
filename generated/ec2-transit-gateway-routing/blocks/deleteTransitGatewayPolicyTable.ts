import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteTransitGatewayPolicyTableCommand,
} from "@aws-sdk/client-ec2";

const deleteTransitGatewayPolicyTable: AppBlock = {
  name: "Delete Transit Gateway Policy Table",
  description: "Deletes the specified transit gateway policy table.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TransitGatewayPolicyTableId: {
          name: "Transit Gateway Policy Table Id",
          description: "The transit gateway policy table to delete.",
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

        const command = new DeleteTransitGatewayPolicyTableCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Transit Gateway Policy Table Result",
      description: "Result from DeleteTransitGatewayPolicyTable operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TransitGatewayPolicyTable: {
            type: "object",
            properties: {
              TransitGatewayPolicyTableId: {
                type: "string",
              },
              TransitGatewayId: {
                type: "string",
              },
              State: {
                type: "string",
              },
              CreationTime: {
                type: "string",
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
              "Provides details about the deleted transit gateway policy table.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteTransitGatewayPolicyTable;
