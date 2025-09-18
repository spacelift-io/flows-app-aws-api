import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeAccountAttributesCommand,
} from "@aws-sdk/client-redshift";

const describeAccountAttributes: AppBlock = {
  name: "Describe Account Attributes",
  description: `Returns a list of attributes attached to an account`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AttributeNames: {
          name: "Attribute Names",
          description: "A list of attribute names.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
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

        const command = new DescribeAccountAttributesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Account Attributes Result",
      description: "Result from DescribeAccountAttributes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AccountAttributes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AttributeName: {
                  type: "string",
                },
                AttributeValues: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      AttributeValue: {
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
            description: "A list of attributes assigned to an account.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAccountAttributes;
