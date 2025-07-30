import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SESClient,
  ListVerifiedEmailAddressesCommand,
} from "@aws-sdk/client-ses";

const listVerifiedEmailAddresses: AppBlock = {
  name: "List Verified Email Addresses",
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

        const command = new ListVerifiedEmailAddressesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Verified Email Addresses Result",
      description: "Result from ListVerifiedEmailAddresses operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VerifiedEmailAddresses: {
            type: "array",
            items: {
              type: "string",
            },
            description: "A list of email addresses that have been verified.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listVerifiedEmailAddresses;
