import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  RemoveLayerVersionPermissionCommand,
} from "@aws-sdk/client-lambda";

const removeLayerVersionPermission: AppBlock = {
  name: "Remove Layer Version Permission",
  description:
    "Removes a statement from the permissions policy for a version of an Lambda layer.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        LayerName: {
          name: "Layer Name",
          description: "The name or Amazon Resource Name (ARN) of the layer.",
          type: "string",
          required: true,
        },
        VersionNumber: {
          name: "Version Number",
          description: "The version number.",
          type: "number",
          required: true,
        },
        StatementId: {
          name: "Statement Id",
          description:
            "The identifier that was specified when the statement was added.",
          type: "string",
          required: true,
        },
        RevisionId: {
          name: "Revision Id",
          description:
            "Only update the policy if the revision ID matches the ID specified.",
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

        const command = new RemoveLayerVersionPermissionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Remove Layer Version Permission Result",
      description: "Result from RemoveLayerVersionPermission operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default removeLayerVersionPermission;
