import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ContinueUpdateRollbackCommand,
} from "@aws-sdk/client-cloudformation";

const continueUpdateRollback: AppBlock = {
  name: "Continue Update Rollback",
  description:
    "For a specified stack that's in the UPDATE_ROLLBACK_FAILED state, continues rolling it back to the UPDATE_ROLLBACK_COMPLETE state.",
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
          description:
            "The name or the unique ID of the stack that you want to continue rolling back.",
          type: "string",
          required: true,
        },
        RoleARN: {
          name: "Role ARN",
          description:
            "The Amazon Resource Name (ARN) of an IAM role that CloudFormation assumes to roll back the stack.",
          type: "string",
          required: false,
        },
        ResourcesToSkip: {
          name: "Resources To Skip",
          description:
            "A list of the logical IDs of the resources that CloudFormation skips during the continue update rollback operation.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        ClientRequestToken: {
          name: "Client Request Token",
          description:
            "A unique identifier for this ContinueUpdateRollback request.",
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
        });

        const command = new ContinueUpdateRollbackCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Continue Update Rollback Result",
      description: "Result from ContinueUpdateRollback operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default continueUpdateRollback;
