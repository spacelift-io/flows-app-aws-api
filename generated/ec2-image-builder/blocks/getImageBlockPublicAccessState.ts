import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetImageBlockPublicAccessStateCommand,
} from "@aws-sdk/client-ec2";

const getImageBlockPublicAccessState: AppBlock = {
  name: "Get Image Block Public Access State",
  description:
    "Gets the current state of block public access for AMIs at the account level in the specified Amazon Web Services Region.",
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

        const command = new GetImageBlockPublicAccessStateCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Image Block Public Access State Result",
      description: "Result from GetImageBlockPublicAccessState operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ImageBlockPublicAccessState: {
            type: "string",
            description:
              "The current state of block public access for AMIs at the account level in the specified Amazon Web Services Region.",
          },
          ManagedBy: {
            type: "string",
            description:
              "The entity that manages the state for block public access for AMIs.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getImageBlockPublicAccessState;
