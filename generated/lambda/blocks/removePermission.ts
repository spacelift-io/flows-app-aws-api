import { AppBlock, events } from "@slflows/sdk/v1";
import { LambdaClient, RemovePermissionCommand } from "@aws-sdk/client-lambda";

const removePermission: AppBlock = {
  name: "Remove Permission",
  description:
    "Revokes function-use permission from an Amazon Web Services service or another Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        FunctionName: {
          name: "Function Name",
          description:
            "The name or ARN of the Lambda function, version, or alias.",
          type: "string",
          required: true,
        },
        StatementId: {
          name: "Statement Id",
          description: "Statement ID of the permission to remove.",
          type: "string",
          required: true,
        },
        Qualifier: {
          name: "Qualifier",
          description:
            "Specify a version or alias to remove permissions from a published version of the function.",
          type: "string",
          required: false,
        },
        RevisionId: {
          name: "Revision Id",
          description:
            "Update the policy only if the revision ID matches the ID that's specified.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new LambdaClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new RemovePermissionCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Remove Permission Result",
      description: "Result from RemovePermission operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default removePermission;
