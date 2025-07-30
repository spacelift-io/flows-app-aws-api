import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyDefaultCreditSpecificationCommand,
} from "@aws-sdk/client-ec2";

const modifyDefaultCreditSpecification: AppBlock = {
  name: "Modify Default Credit Specification",
  description:
    "Modifies the default credit option for CPU usage of burstable performance instances.",
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
            "Checks whether you have the required permissions for the operation, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        InstanceFamily: {
          name: "Instance Family",
          description: "The instance family.",
          type: "string",
          required: true,
        },
        CpuCredits: {
          name: "Cpu Credits",
          description:
            "The credit option for CPU usage of the instance family.",
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
        });

        const command = new ModifyDefaultCreditSpecificationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Default Credit Specification Result",
      description: "Result from ModifyDefaultCreditSpecification operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceFamilyCreditSpecification: {
            type: "object",
            properties: {
              InstanceFamily: {
                type: "string",
              },
              CpuCredits: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The default credit option for CPU usage of the instance family.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyDefaultCreditSpecification;
