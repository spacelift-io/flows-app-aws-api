import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  GetContextKeysForPrincipalPolicyCommand,
} from "@aws-sdk/client-iam";

const getContextKeysForPrincipalPolicy: AppBlock = {
  name: "Get Context Keys For Principal Policy",
  description:
    "Gets a list of all of the context keys referenced in all the IAM policies that are attached to the specified IAM entity.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PolicySourceArn: {
          name: "Policy Source Arn",
          description:
            "The ARN of a user, group, or role whose policies contain the context keys that you want listed.",
          type: "string",
          required: true,
        },
        PolicyInputList: {
          name: "Policy Input List",
          description:
            "An optional list of additional policies for which you want the list of context keys that are referenced.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GetContextKeysForPrincipalPolicyCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Context Keys For Principal Policy Result",
      description: "Result from GetContextKeysForPrincipalPolicy operation",
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

export default getContextKeysForPrincipalPolicy;
