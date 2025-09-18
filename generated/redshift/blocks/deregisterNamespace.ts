import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DeregisterNamespaceCommand,
} from "@aws-sdk/client-redshift";

const deregisterNamespace: AppBlock = {
  name: "Deregister Namespace",
  description: `Deregisters a cluster or serverless namespace from the Amazon Web Services Glue Data Catalog.`,
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
            "The unique identifier of the cluster or serverless namespace that you want to deregister.",
          type: "string",
          required: true,
        },
        ConsumerIdentifiers: {
          name: "Consumer Identifiers",
          description:
            "An array containing the ID of the consumer account that you want to deregister the cluster or serverless namespace from.",
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

        const command = new DeregisterNamespaceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Deregister Namespace Result",
      description: "Result from DeregisterNamespace operation",
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

export default deregisterNamespace;
