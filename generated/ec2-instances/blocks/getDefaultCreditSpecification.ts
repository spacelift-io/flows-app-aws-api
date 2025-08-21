import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetDefaultCreditSpecificationCommand,
} from "@aws-sdk/client-ec2";

const getDefaultCreditSpecification: AppBlock = {
  name: "Get Default Credit Specification",
  description:
    "Describes the default credit option for CPU usage of a burstable performance instance family.",
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

        const command = new GetDefaultCreditSpecificationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Default Credit Specification Result",
      description: "Result from GetDefaultCreditSpecification operation",
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

export default getDefaultCreditSpecification;
