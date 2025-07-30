import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ExecuteChangeSetCommand,
} from "@aws-sdk/client-cloudformation";

const executeChangeSet: AppBlock = {
  name: "Execute Change Set",
  description:
    "Updates a stack using the input information that was provided when the specified change set was created.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ChangeSetName: {
          name: "Change Set Name",
          description:
            "The name or Amazon Resource Name (ARN) of the change set that you want use to update the specified stack.",
          type: "string",
          required: true,
        },
        StackName: {
          name: "Stack Name",
          description:
            "If you specified the name of a change set, specify the stack name or Amazon Resource Name (ARN) that's associated with the change set you want to execute.",
          type: "string",
          required: false,
        },
        ClientRequestToken: {
          name: "Client Request Token",
          description: "A unique identifier for this ExecuteChangeSet request.",
          type: "string",
          required: false,
        },
        DisableRollback: {
          name: "Disable Rollback",
          description:
            "Preserves the state of previously provisioned resources when an operation fails.",
          type: "boolean",
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
        });

        const command = new ExecuteChangeSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Execute Change Set Result",
      description: "Result from ExecuteChangeSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default executeChangeSet;
