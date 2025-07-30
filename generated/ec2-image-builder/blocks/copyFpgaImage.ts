import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CopyFpgaImageCommand } from "@aws-sdk/client-ec2";

const copyFpgaImage: AppBlock = {
  name: "Copy Fpga Image",
  description:
    "Copies the specified Amazon FPGA Image (AFI) to the current Region.",
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
        SourceFpgaImageId: {
          name: "Source Fpga Image Id",
          description: "The ID of the source AFI.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "The description for the new AFI.",
          type: "string",
          required: false,
        },
        Name: {
          name: "Name",
          description: "The name for the new AFI.",
          type: "string",
          required: false,
        },
        SourceRegion: {
          name: "Source Region",
          description: "The Region that contains the source AFI.",
          type: "string",
          required: true,
        },
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
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

        const command = new CopyFpgaImageCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Copy Fpga Image Result",
      description: "Result from CopyFpgaImage operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FpgaImageId: {
            type: "string",
            description: "The ID of the new AFI.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default copyFpgaImage;
