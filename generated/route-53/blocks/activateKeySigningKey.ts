import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  ActivateKeySigningKeyCommand,
} from "@aws-sdk/client-route-53";

const activateKeySigningKey: AppBlock = {
  name: "Activate Key Signing Key",
  description:
    "Activates a key-signing key (KSK) so that it can be used for signing by DNSSEC.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HostedZoneId: {
          name: "Hosted Zone Id",
          description: "A unique string used to identify a hosted zone.",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "A string used to identify a key-signing key (KSK).",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new Route53Client({
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

        const command = new ActivateKeySigningKeyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Activate Key Signing Key Result",
      description: "Result from ActivateKeySigningKey operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeInfo: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              Status: {
                type: "string",
              },
              SubmittedAt: {
                type: "string",
              },
              Comment: {
                type: "string",
              },
            },
            required: ["Id", "Status", "SubmittedAt"],
            additionalProperties: false,
            description:
              "A complex type that describes change information about changes made to your hosted zone.",
          },
        },
        required: ["ChangeInfo"],
      },
    },
  },
};

export default activateKeySigningKey;
