import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  GetEventDataStoreCommand,
} from "@aws-sdk/client-cloudtrail";

const getEventDataStore: AppBlock = {
  name: "Get Event Data Store",
  description:
    "Returns information about an event data store specified as either an ARN or the ID portion of the ARN.",
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
            "The ARN (or ID suffix of the ARN) of the event data store about which you want information.",
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
        });

        const command = new GetEventDataStoreCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Event Data Store Result",
      description: "Result from GetEventDataStore operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          EventDataStoreArn: {
            type: "string",
            description: "The event data store Amazon Resource Number (ARN).",
          },
          Name: {
            type: "string",
            description: "The name of the event data store.",
          },
          Status: {
            type: "string",
            description: "The status of an event data store.",
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
              "The advanced event selectors used to select events for the data store.",
          },
          MultiRegionEnabled: {
            type: "boolean",
            description:
              "Indicates whether the event data store includes events from all Regions, or only from the Region in which it was created.",
          },
          OrganizationEnabled: {
            type: "boolean",
            description:
              "Indicates whether an event data store is collecting logged events for an organization in Organizations.",
          },
          RetentionPeriod: {
            type: "number",
            description:
              "The retention period of the event data store, in days.",
          },
          TerminationProtectionEnabled: {
            type: "boolean",
            description: "Indicates that termination protection is enabled.",
          },
          CreatedTimestamp: {
            type: "string",
            description: "The timestamp of the event data store's creation.",
          },
          UpdatedTimestamp: {
            type: "string",
            description:
              "Shows the time that an event data store was updated, if applicable.",
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
          FederationStatus: {
            type: "string",
            description: "Indicates the Lake query federation status.",
          },
          FederationRoleArn: {
            type: "string",
            description:
              "If Lake query federation is enabled, provides the ARN of the federation role used to access the resources for the federated event data store.",
          },
          PartitionKeys: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Type: {
                  type: "string",
                },
              },
              required: ["Name", "Type"],
              additionalProperties: false,
            },
            description: "The partition keys for the event data store.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getEventDataStore;
