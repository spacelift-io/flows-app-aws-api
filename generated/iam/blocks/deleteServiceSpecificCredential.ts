import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  DeleteServiceSpecificCredentialCommand,
} from "@aws-sdk/client-iam";

const deleteServiceSpecificCredential: AppBlock = {
  name: "Delete Service Specific Credential",
  description: "Deletes the specified service-specific credential.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        UserName: {
          name: "User Name",
          description:
            "The name of the IAM user associated with the service-specific credential.",
          type: "string",
          required: false,
        },
        ServiceSpecificCredentialId: {
          name: "Service Specific Credential Id",
          description:
            "The unique identifier of the service-specific credential.",
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

        const command = new DeleteServiceSpecificCredentialCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Service Specific Credential Result",
      description: "Result from DeleteServiceSpecificCredential operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default deleteServiceSpecificCredential;
