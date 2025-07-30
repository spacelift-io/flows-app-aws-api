import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  GetContextKeysForCustomPolicyCommand,
} from "@aws-sdk/client-iam";

const getContextKeysForCustomPolicy: AppBlock = {
  name: "Get Context Keys For Custom Policy",
  description:
    "Gets a list of all of the context keys referenced in the input policies.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PolicyInputList: {
          name: "Policy Input List",
          description:
            "A list of policies for which you want the list of context keys referenced in those policies.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetContextKeysForCustomPolicyCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Context Keys For Custom Policy Result",
      description: "Result from GetContextKeysForCustomPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ContextKeyNames: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The list of context keys that are referenced in the input policies.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getContextKeysForCustomPolicy;
