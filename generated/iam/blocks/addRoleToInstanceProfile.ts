import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  AddRoleToInstanceProfileCommand,
} from "@aws-sdk/client-iam";

const addRoleToInstanceProfile: AppBlock = {
  name: "Add Role To Instance Profile",
  description: "Adds the specified IAM role to the specified instance profile.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        InstanceProfileName: {
          name: "Instance Profile Name",
          description: "The name of the instance profile to update.",
          type: "string",
          required: true,
        },
        RoleName: {
          name: "Role Name",
          description: "The name of the role to add.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new AddRoleToInstanceProfileCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Add Role To Instance Profile Result",
      description: "Result from AddRoleToInstanceProfile operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default addRoleToInstanceProfile;
