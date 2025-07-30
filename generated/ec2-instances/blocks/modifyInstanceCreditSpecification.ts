import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyInstanceCreditSpecificationCommand,
} from "@aws-sdk/client-ec2";

const modifyInstanceCreditSpecification: AppBlock = {
  name: "Modify Instance Credit Specification",
  description:
    "Modifies the credit option for CPU usage on a running or stopped burstable performance instance.",
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
        ClientToken: {
          name: "Client Token",
          description:
            "A unique, case-sensitive token that you provide to ensure idempotency of your modification request.",
          type: "string",
          required: false,
        },
        InstanceCreditSpecifications: {
          name: "Instance Credit Specifications",
          description: "Information about the credit option for CPU usage.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InstanceId: {
                  type: "string",
                },
                CpuCredits: {
                  type: "string",
                },
              },
              required: ["InstanceId"],
              additionalProperties: false,
            },
          },
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

        const command = new ModifyInstanceCreditSpecificationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Instance Credit Specification Result",
      description: "Result from ModifyInstanceCreditSpecification operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SuccessfulInstanceCreditSpecifications: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InstanceId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the instances whose credit option for CPU usage was successfully modified.",
          },
          UnsuccessfulInstanceCreditSpecifications: {
            type: "array",
            items: {
              type: "object",
              properties: {
                InstanceId: {
                  type: "string",
                },
                Error: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "string",
                    },
                    Message: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the instances whose credit option for CPU usage was not modified.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyInstanceCreditSpecification;
