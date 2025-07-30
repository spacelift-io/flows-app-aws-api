import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DeleteCarrierGatewayCommand } from "@aws-sdk/client-ec2";

const deleteCarrierGateway: AppBlock = {
  name: "Delete Carrier Gateway",
  description: "Deletes a carrier gateway.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CarrierGatewayId: {
          name: "Carrier Gateway Id",
          description: "The ID of the carrier gateway.",
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
        });

        const command = new DeleteCarrierGatewayCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Carrier Gateway Result",
      description: "Result from DeleteCarrierGateway operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CarrierGateway: {
            type: "object",
            properties: {
              CarrierGatewayId: {
                type: "string",
              },
              VpcId: {
                type: "string",
              },
              State: {
                type: "string",
              },
              OwnerId: {
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
            description: "Information about the carrier gateway.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteCarrierGateway;
