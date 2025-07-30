import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  UpdateServiceSpecificCredentialCommand,
} from "@aws-sdk/client-iam";

const updateServiceSpecificCredential: AppBlock = {
  name: "Update Service Specific Credential",
  description:
    "Sets the status of a service-specific credential to Active or Inactive.",
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
        Status: {
          name: "Status",
          description:
            "The status to be assigned to the service-specific credential.",
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

        const command = new UpdateServiceSpecificCredentialCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Service Specific Credential Result",
      description: "Result from UpdateServiceSpecificCredential operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default updateServiceSpecificCredential;
