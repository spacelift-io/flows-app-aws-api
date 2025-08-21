import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  ResetServiceSpecificCredentialCommand,
} from "@aws-sdk/client-iam";

const resetServiceSpecificCredential: AppBlock = {
  name: "Reset Service Specific Credential",
  description: "Resets the password for a service-specific credential.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ResetServiceSpecificCredentialCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Reset Service Specific Credential Result",
      description: "Result from ResetServiceSpecificCredential operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ServiceSpecificCredential: {
            type: "object",
            properties: {
              CreateDate: {
                type: "string",
              },
              ExpirationDate: {
                type: "string",
              },
              ServiceName: {
                type: "string",
              },
              ServiceUserName: {
                type: "string",
              },
              ServicePassword: {
                type: "string",
              },
              ServiceCredentialAlias: {
                type: "string",
              },
              ServiceCredentialSecret: {
                type: "string",
              },
              ServiceSpecificCredentialId: {
                type: "string",
              },
              UserName: {
                type: "string",
              },
              Status: {
                type: "string",
              },
            },
            required: [
              "CreateDate",
              "ServiceName",
              "ServiceSpecificCredentialId",
              "UserName",
              "Status",
            ],
            additionalProperties: false,
            description:
              "A structure with details about the updated service-specific credential, including the new password.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default resetServiceSpecificCredential;
