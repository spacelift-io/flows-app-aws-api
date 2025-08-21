import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  RollbackStackCommand,
} from "@aws-sdk/client-cloudformation";

const rollbackStack: AppBlock = {
  name: "Rollback Stack",
  description:
    "When specifying RollbackStack, you preserve the state of previously provisioned resources when an operation fails.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StackName: {
          name: "Stack Name",
          description: "The name that's associated with the stack.",
          type: "string",
          required: true,
        },
        RoleARN: {
          name: "Role ARN",
          description:
            "The Amazon Resource Name (ARN) of an IAM role that CloudFormation assumes to rollback the stack.",
          type: "string",
          required: false,
        },
        ClientRequestToken: {
          name: "Client Request Token",
          description: "A unique identifier for this RollbackStack request.",
          type: "string",
          required: false,
        },
        RetainExceptOnCreate: {
          name: "Retain Except On Create",
          description:
            "When set to true, newly created resources are deleted when the operation rolls back.",
          type: "boolean",
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

        const command = new RollbackStackCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Rollback Stack Result",
      description: "Result from RollbackStack operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackId: {
            type: "string",
            description: "Unique identifier of the stack.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default rollbackStack;
