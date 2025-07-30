import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyInstanceCapacityReservationAttributesCommand,
} from "@aws-sdk/client-ec2";

const modifyInstanceCapacityReservationAttributes: AppBlock = {
  name: "Modify Instance Capacity Reservation Attributes",
  description:
    "Modifies the Capacity Reservation settings for a stopped instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the instance to be modified.",
          type: "string",
          required: true,
        },
        CapacityReservationSpecification: {
          name: "Capacity Reservation Specification",
          description:
            "Information about the Capacity Reservation targeting option.",
          type: {
            type: "object",
            properties: {
              CapacityReservationPreference: {
                type: "string",
              },
              CapacityReservationTarget: {
                type: "object",
                properties: {
                  CapacityReservationId: {
                    type: "string",
                  },
                  CapacityReservationResourceGroupArn: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
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

        const command = new ModifyInstanceCapacityReservationAttributesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Instance Capacity Reservation Attributes Result",
      description:
        "Result from ModifyInstanceCapacityReservationAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Returns true if the request succeeds; otherwise, it returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyInstanceCapacityReservationAttributes;
