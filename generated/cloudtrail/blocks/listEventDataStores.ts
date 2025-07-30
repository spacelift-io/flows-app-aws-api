import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  ListEventDataStoresCommand,
} from "@aws-sdk/client-cloudtrail";

const listEventDataStores: AppBlock = {
  name: "List Event Data Stores",
  description:
    "Returns information about all event data stores in the account, in the current Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "A token you can use to get the next page of event data store results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of event data stores to display on a single page.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudTrailClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListEventDataStoresCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Event Data Stores Result",
      description: "Result from ListEventDataStores operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EventDataStores: {
            type: "array",
            items: {
              type: "object",
              properties: {
                EventDataStoreArn: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                TerminationProtectionEnabled: {
                  type: "boolean",
                },
                Status: {
                  type: "string",
                },
                AdvancedEventSelectors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Name: {
                        type: "object",
                        additionalProperties: true,
                      },
                      FieldSelectors: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["FieldSelectors"],
                    additionalProperties: false,
                  },
                },
                MultiRegionEnabled: {
                  type: "boolean",
                },
                OrganizationEnabled: {
                  type: "boolean",
                },
                RetentionPeriod: {
                  type: "number",
                },
                CreatedTimestamp: {
                  type: "string",
                },
                UpdatedTimestamp: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Contains information about event data stores in the account, in the current Region.",
          },
          NextToken: {
            type: "string",
            description: "A token you can use to get the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listEventDataStores;
