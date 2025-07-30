import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeEffectiveInstanceAssociationsCommand,
} from "@aws-sdk/client-ssm";

const describeEffectiveInstanceAssociations: AppBlock = {
  name: "Describe Effective Instance Associations",
  description: "All associations for the managed nodes.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceId: {
          name: "Instance Id",
          description:
            "The managed node ID for which you want to view all associations.",
          type: "string",
          required: true,
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
        });

        const command = new DescribeEffectiveInstanceAssociationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Effective Instance Associations Result",
      description:
        "Result from DescribeEffectiveInstanceAssociations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Associations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AssociationId: {
                  type: "string",
                },
                InstanceId: {
                  type: "string",
                },
                Content: {
                  type: "string",
                },
                AssociationVersion: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The associations for the requested managed node.",
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

export default describeEffectiveInstanceAssociations;
