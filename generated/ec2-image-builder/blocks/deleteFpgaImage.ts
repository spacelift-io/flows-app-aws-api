import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DeleteFpgaImageCommand } from "@aws-sdk/client-ec2";

const deleteFpgaImage: AppBlock = {
  name: "Delete Fpga Image",
  description: "Deletes the specified Amazon FPGA Image (AFI).",
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
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        FpgaImageId: {
          name: "Fpga Image Id",
          description: "The ID of the AFI.",
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

        const command = new DeleteFpgaImageCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Fpga Image Result",
      description: "Result from DeleteFpgaImage operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Is true if the request succeeds, and an error otherwise.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteFpgaImage;
