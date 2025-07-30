import { AppBlock, events } from "@slflows/sdk/v1";
import {
  LambdaClient,
  AddLayerVersionPermissionCommand,
} from "@aws-sdk/client-lambda";

const addLayerVersionPermission: AppBlock = {
  name: "Add Layer Version Permission",
  description:
    "Adds permissions to the resource-based policy of a version of an Lambda layer.",
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
            "An identifier that distinguishes the policy from others on the same layer version.",
          type: "string",
          required: true,
        },
        Action: {
          name: "Action",
          description: "The API action that grants access to the layer.",
          type: "string",
          required: true,
        },
        Principal: {
          name: "Principal",
          description:
            "An account ID, or * to grant layer usage permission to all accounts in an organization, or all Amazon Web Services accounts (if organizationId is not specified).",
          type: "string",
          required: true,
        },
        OrganizationId: {
          name: "Organization Id",
          description:
            "With the principal set to *, grant permission to all accounts in the specified organization.",
          type: "string",
          required: false,
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

        const command = new AddLayerVersionPermissionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Add Layer Version Permission Result",
      description: "Result from AddLayerVersionPermission operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Statement: {
            type: "string",
            description: "The permission statement.",
          },
          RevisionId: {
            type: "string",
            description:
              "A unique identifier for the current revision of the policy.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default addLayerVersionPermission;
