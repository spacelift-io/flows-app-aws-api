import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DeleteChangeSetCommand,
} from "@aws-sdk/client-cloudformation";

const deleteChangeSet: AppBlock = {
  name: "Delete Change Set",
  description: "Deletes the specified change set.",
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
            "The name or Amazon Resource Name (ARN) of the change set that you want to delete.",
          type: "string",
          required: true,
        },
        StackName: {
          name: "Stack Name",
          description:
            "If you specified the name of a change set to delete, specify the stack name or Amazon Resource Name (ARN) that's associated with it.",
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

        const command = new DeleteChangeSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Change Set Result",
      description: "Result from DeleteChangeSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteChangeSet;
