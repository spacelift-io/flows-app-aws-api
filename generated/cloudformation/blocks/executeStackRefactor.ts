import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ExecuteStackRefactorCommand,
} from "@aws-sdk/client-cloudformation";

const executeStackRefactor: AppBlock = {
  name: "Execute Stack Refactor",
  description: "Executes the stack refactor operation.",
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

        const command = new ExecuteStackRefactorCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Execute Stack Refactor Result",
      description: "Result from ExecuteStackRefactor operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default executeStackRefactor;
