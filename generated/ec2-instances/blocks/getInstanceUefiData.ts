import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, GetInstanceUefiDataCommand } from "@aws-sdk/client-ec2";

const getInstanceUefiData: AppBlock = {
  name: "Get Instance Uefi Data",
  description: "A binary representation of the UEFI variable store.",
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
          description:
            "The ID of the instance from which to retrieve the UEFI data.",
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

        const command = new GetInstanceUefiDataCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Instance Uefi Data Result",
      description: "Result from GetInstanceUefiData operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceId: {
            type: "string",
            description:
              "The ID of the instance from which to retrieve the UEFI data.",
          },
          UefiData: {
            type: "string",
            description:
              "Base64 representation of the non-volatile UEFI variable store.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getInstanceUefiData;
