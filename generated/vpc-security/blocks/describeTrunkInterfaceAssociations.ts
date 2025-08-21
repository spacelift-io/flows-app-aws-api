import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeTrunkInterfaceAssociationsCommand,
} from "@aws-sdk/client-ec2";

const describeTrunkInterfaceAssociations: AppBlock = {
  name: "Describe Trunk Interface Associations",
  description: "Describes one or more network interface trunk associations.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AssociationIds: {
          name: "Association Ids",
          description: "The IDs of the associations.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "One or more filters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next page of results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return with a single call.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new DescribeTrunkInterfaceAssociationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Trunk Interface Associations Result",
      description: "Result from DescribeTrunkInterfaceAssociations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InterfaceAssociations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AssociationId: {
                  type: "string",
                },
                BranchInterfaceId: {
                  type: "string",
                },
                TrunkInterfaceId: {
                  type: "string",
                },
                InterfaceProtocol: {
                  type: "string",
                },
                VlanId: {
                  type: "number",
                },
                GreKey: {
                  type: "number",
                },
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description: "Information about the trunk associations.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeTrunkInterfaceAssociations;
