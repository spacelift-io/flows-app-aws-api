import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  DeleteVerifiedEmailAddressCommand,
} from "@aws-sdk/client-ses";

const deleteVerifiedEmailAddress: AppBlock = {
  name: "Delete Verified Email Address",
  description: "Deprecated.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EmailAddress: {
          name: "Email Address",
          description:
            "An email address to be removed from the list of verified addresses.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SESClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DeleteVerifiedEmailAddressCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Verified Email Address Result",
      description: "Result from DeleteVerifiedEmailAddress operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteVerifiedEmailAddress;
