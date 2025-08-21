import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, ListAssociationsCommand } from "@aws-sdk/client-ssm";

const listAssociations: AppBlock = {
  name: "List Associations",
  description:
    "Returns all State Manager associations in the current Amazon Web Services account and Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AssociationFilterList: {
          name: "Association Filter List",
          description: "One or more filters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                },
                value: {
                  type: "string",
                },
              },
              required: ["key", "value"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
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

        const command = new ListAssociationsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Associations Result",
      description: "Result from ListAssociations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Associations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                InstanceId: {
                  type: "string",
                },
                AssociationId: {
                  type: "string",
                },
                AssociationVersion: {
                  type: "string",
                },
                DocumentVersion: {
                  type: "string",
                },
                Targets: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Values: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                LastExecutionDate: {
                  type: "string",
                },
                Overview: {
                  type: "object",
                  properties: {
                    Status: {
                      type: "string",
                    },
                    DetailedStatus: {
                      type: "string",
                    },
                    AssociationStatusAggregatedCount: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                    },
                  },
                  additionalProperties: false,
                },
                ScheduleExpression: {
                  type: "string",
                },
                AssociationName: {
                  type: "string",
                },
                ScheduleOffset: {
                  type: "number",
                },
                Duration: {
                  type: "number",
                },
                TargetMaps: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: {
                      type: "object",
                    },
                  },
                },
              },
              additionalProperties: false,
            },
            description: "The associations.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use when requesting the next set of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listAssociations;
