import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  RegisterNamespaceCommand,
} from "@aws-sdk/client-redshift";

const registerNamespace: AppBlock = {
  name: "Register Namespace",
  description: `Registers a cluster or serverless namespace to the Amazon Web Services Glue Data Catalog.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NamespaceIdentifier: {
          name: "Namespace Identifier",
          description:
            "The unique identifier of the cluster or serverless namespace that you want to register.",
          type: "string",
          required: true,
        },
        ConsumerIdentifiers: {
          name: "Consumer Identifiers",
          description:
            "An array containing the ID of the consumer account that you want to register the namespace to.",
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

        const client = new RedshiftClient({
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

        const command = new RegisterNamespaceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Register Namespace Result",
      description: "Result from RegisterNamespace operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Status: {
            type: "string",
            description:
              "The registration status of the cluster or serverless namespace.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default registerNamespace;
