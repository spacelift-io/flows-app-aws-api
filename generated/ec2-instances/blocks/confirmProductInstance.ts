import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ConfirmProductInstanceCommand } from "@aws-sdk/client-ec2";

const confirmProductInstance: AppBlock = {
  name: "Confirm Product Instance",
  description:
    "Determines whether a product code is associated with an instance.",
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
          description: "The ID of the instance.",
          type: "string",
          required: true,
        },
        ProductCode: {
          name: "Product Code",
          description: "The product code.",
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

        const command = new ConfirmProductInstanceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Confirm Product Instance Result",
      description: "Result from ConfirmProductInstance operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description: "The return value of the request.",
          },
          OwnerId: {
            type: "string",
            description:
              "The Amazon Web Services account ID of the instance owner.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default confirmProductInstance;
