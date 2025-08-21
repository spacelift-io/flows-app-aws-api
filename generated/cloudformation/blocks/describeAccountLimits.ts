import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DescribeAccountLimitsCommand,
} from "@aws-sdk/client-cloudformation";

const describeAccountLimits: AppBlock = {
  name: "Describe Account Limits",
  description:
    "Retrieves your account's CloudFormation limits, such as the maximum number of stacks that you can create in your account.",
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
            "A string that identifies the next page of limits that you want to retrieve.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
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

        const command = new DescribeAccountLimitsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Account Limits Result",
      description: "Result from DescribeAccountLimits operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AccountLimits: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Value: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description:
              "An account limit structure that contain a list of CloudFormation account limits and their values.",
          },
          NextToken: {
            type: "string",
            description:
              "If the output exceeds 1 MB in size, a string that identifies the next page of limits.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAccountLimits;
