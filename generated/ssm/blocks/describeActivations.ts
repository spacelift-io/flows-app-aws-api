import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DescribeActivationsCommand } from "@aws-sdk/client-ssm";

const describeActivations: AppBlock = {
  name: "Describe Activations",
  description:
    "Describes details about the activation, such as the date and time the activation was created, its expiration date, the Identity and Access Management (IAM) role assigned to the managed nodes in the activation, and the number of nodes registered by using this activation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description: "A filter to view information about your activations.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                FilterKey: {
                  type: "string",
                },
                FilterValues: {
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
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "A token to start the list.",
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
        });

        const command = new DescribeActivationsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Activations Result",
      description: "Result from DescribeActivations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ActivationList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ActivationId: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                DefaultInstanceName: {
                  type: "string",
                },
                IamRole: {
                  type: "string",
                },
                RegistrationLimit: {
                  type: "number",
                },
                RegistrationsCount: {
                  type: "number",
                },
                ExpirationDate: {
                  type: "string",
                },
                Expired: {
                  type: "boolean",
                },
                CreatedDate: {
                  type: "string",
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
                    required: ["Key", "Value"],
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of activations for your Amazon Web Services account.",
          },
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeActivations;
