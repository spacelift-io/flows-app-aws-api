import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  EnableImageBlockPublicAccessCommand,
} from "@aws-sdk/client-ec2";

const enableImageBlockPublicAccess: AppBlock = {
  name: "Enable Image Block Public Access",
  description:
    "Enables block public access for AMIs at the account level in the specified Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ImageBlockPublicAccessState: {
          name: "Image Block Public Access State",
          description:
            "Specify block-new-sharing to enable block public access for AMIs at the account level in the specified Region.",
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

        const command = new EnableImageBlockPublicAccessCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Image Block Public Access Result",
      description: "Result from EnableImageBlockPublicAccess operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ImageBlockPublicAccessState: {
            type: "string",
            description:
              "Returns block-new-sharing if the request succeeds; otherwise, it returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default enableImageBlockPublicAccess;
