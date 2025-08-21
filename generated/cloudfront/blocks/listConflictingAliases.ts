import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  ListConflictingAliasesCommand,
} from "@aws-sdk/client-cloudfront";

const listConflictingAliases: AppBlock = {
  name: "List Conflicting Aliases",
  description:
    "The ListConflictingAliases API operation only supports standard distributions.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DistributionId: {
          name: "Distribution Id",
          description:
            "The ID of a standard distribution in your account that has an attached TLS certificate that includes the provided alias.",
          type: "string",
          required: true,
        },
        Alias: {
          name: "Alias",
          description:
            "The alias (also called a CNAME) to search for conflicting aliases.",
          type: "string",
          required: true,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this field when paginating results to indicate where to begin in the list of conflicting aliases.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "The maximum number of conflicting aliases that you want in the response.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
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

        const command = new ListConflictingAliasesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Conflicting Aliases Result",
      description: "Result from ListConflictingAliases operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ConflictingAliasesList: {
            type: "object",
            properties: {
              NextMarker: {
                type: "string",
              },
              MaxItems: {
                type: "number",
              },
              Quantity: {
                type: "number",
              },
              Items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Alias: {
                      type: "string",
                    },
                    DistributionId: {
                      type: "string",
                    },
                    AccountId: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "A list of conflicting aliases.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listConflictingAliases;
