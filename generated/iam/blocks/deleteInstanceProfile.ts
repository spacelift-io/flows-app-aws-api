import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, DeleteInstanceProfileCommand } from "@aws-sdk/client-iam";

const deleteInstanceProfile: AppBlock = {
  name: "Delete Instance Profile",
  description: "Deletes the specified instance profile.",
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
          description: "The name of the instance profile to delete.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeleteInstanceProfileCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Instance Profile Result",
      description: "Result from DeleteInstanceProfile operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteInstanceProfile;
