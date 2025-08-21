import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  RestoreEventDataStoreCommand,
} from "@aws-sdk/client-cloudtrail";

const restoreEventDataStore: AppBlock = {
  name: "Restore Event Data Store",
  description:
    "Restores a deleted event data store specified by EventDataStore, which accepts an event data store ARN.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EventDataStore: {
          name: "Event Data Store",
          description:
            "The ARN (or the ID suffix of the ARN) of the event data store that you want to restore.",
          type: "string",
          required: true,
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new RestoreEventDataStoreCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Restore Event Data Store Result",
      description: "Result from RestoreEventDataStore operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EventDataStoreArn: {
            type: "string",
            description: "The event data store ARN.",
          },
          Name: {
            type: "string",
            description: "The name of the event data store.",
          },
          Status: {
            type: "string",
            description: "The status of the event data store.",
          },
          AdvancedEventSelectors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                FieldSelectors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Field: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Equals: {
                        type: "object",
                        additionalProperties: true,
                      },
                      StartsWith: {
                        type: "object",
                        additionalProperties: true,
                      },
                      EndsWith: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NotEquals: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NotStartsWith: {
                        type: "object",
                        additionalProperties: true,
                      },
                      NotEndsWith: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Field"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["FieldSelectors"],
              additionalProperties: false,
            },
            description:
              "The advanced event selectors that were used to select events.",
          },
          MultiRegionEnabled: {
            type: "boolean",
            description:
              "Indicates whether the event data store is collecting events from all Regions, or only from the Region in which the event data store was created.",
          },
          OrganizationEnabled: {
            type: "boolean",
            description:
              "Indicates whether an event data store is collecting logged events for an organization in Organizations.",
          },
          RetentionPeriod: {
            type: "number",
            description: "The retention period, in days.",
          },
          TerminationProtectionEnabled: {
            type: "boolean",
            description:
              "Indicates that termination protection is enabled and the event data store cannot be automatically deleted.",
          },
          CreatedTimestamp: {
            type: "string",
            description: "The timestamp of an event data store's creation.",
          },
          UpdatedTimestamp: {
            type: "string",
            description:
              "The timestamp that shows when an event data store was updated, if applicable.",
          },
          KmsKeyId: {
            type: "string",
            description:
              "Specifies the KMS key ID that encrypts the events delivered by CloudTrail.",
          },
          BillingMode: {
            type: "string",
            description: "The billing mode for the event data store.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default restoreEventDataStore;
