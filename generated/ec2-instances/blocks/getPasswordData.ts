import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, GetPasswordDataCommand } from "@aws-sdk/client-ec2";

const getPasswordData: AppBlock = {
  name: "Get Password Data",
  description:
    "Retrieves the encrypted administrator password for a running Windows instance.",
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
          description: "The ID of the Windows instance.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetPasswordDataCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Password Data Result",
      description: "Result from GetPasswordData operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceId: {
            type: "string",
            description: "The ID of the Windows instance.",
          },
          Timestamp: {
            type: "string",
            description: "The time the data was last updated.",
          },
          PasswordData: {
            type: "string",
            description: "The password of the instance.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getPasswordData;
