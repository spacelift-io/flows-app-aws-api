import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DescribeStackRefactorCommand,
} from "@aws-sdk/client-cloudformation";

const describeStackRefactor: AppBlock = {
  name: "Describe Stack Refactor",
  description: "Describes the stack refactor status.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StackRefactorId: {
          name: "Stack Refactor Id",
          description:
            "The ID associated with the stack refactor created from the CreateStackRefactor action.",
          type: "string",
          required: true,
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
        });

        const command = new DescribeStackRefactorCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Stack Refactor Result",
      description: "Result from DescribeStackRefactor operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Description: {
            type: "string",
            description: "A description to help you identify the refactor.",
          },
          StackRefactorId: {
            type: "string",
            description:
              "The ID associated with the stack refactor created from the CreateStackRefactor action.",
          },
          StackIds: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The unique ID for each stack.",
          },
          ExecutionStatus: {
            type: "string",
            description:
              "The stack refactor execution operation status that's provided after calling the ExecuteStackRefactor action.",
          },
          ExecutionStatusReason: {
            type: "string",
            description:
              "A detailed explanation for the stack refactor ExecutionStatus.",
          },
          Status: {
            type: "string",
            description:
              "The stack refactor operation status that's provided after calling the CreateStackRefactor action.",
          },
          StatusReason: {
            type: "string",
            description:
              "A detailed explanation for the stack refactor operation Status.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeStackRefactor;
