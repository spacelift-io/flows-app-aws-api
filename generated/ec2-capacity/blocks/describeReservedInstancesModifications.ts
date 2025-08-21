import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeReservedInstancesModificationsCommand,
} from "@aws-sdk/client-ec2";

const describeReservedInstancesModifications: AppBlock = {
  name: "Describe Reserved Instances Modifications",
  description: "Describes the modifications made to your Reserved Instances.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ReservedInstancesModificationIds: {
          name: "Reserved Instances Modification Ids",
          description: "IDs for the submitted modification request.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to retrieve the next page of results.",
          type: "string",
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

        const command = new DescribeReservedInstancesModificationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Reserved Instances Modifications Result",
      description:
        "Result from DescribeReservedInstancesModifications operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
          ReservedInstancesModifications: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ClientToken: {
                  type: "string",
                },
                CreateDate: {
                  type: "string",
                },
                EffectiveDate: {
                  type: "string",
                },
                ModificationResults: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ReservedInstancesId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      TargetConfiguration: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                ReservedInstancesIds: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ReservedInstancesId: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                ReservedInstancesModificationId: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusMessage: {
                  type: "string",
                },
                UpdateDate: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The Reserved Instance modification information.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeReservedInstancesModifications;
