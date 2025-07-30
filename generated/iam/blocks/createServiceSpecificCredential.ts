import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  CreateServiceSpecificCredentialCommand,
} from "@aws-sdk/client-iam";

const createServiceSpecificCredential: AppBlock = {
  name: "Create Service Specific Credential",
  description:
    "Generates a set of credentials consisting of a user name and password that can be used to access the service specified in the request.",
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
            "The name of the IAM user that is to be associated with the credentials.",
          type: "string",
          required: true,
        },
        ServiceName: {
          name: "Service Name",
          description:
            "The name of the Amazon Web Services service that is to be associated with the credentials.",
          type: "string",
          required: true,
        },
        CredentialAgeDays: {
          name: "Credential Age Days",
          description:
            "The number of days until the service specific credential expires.",
          type: "number",
          required: false,
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

        const command = new CreateServiceSpecificCredentialCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Service Specific Credential Result",
      description: "Result from CreateServiceSpecificCredential operation",
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
              "A structure that contains information about the newly created service-specific credential.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createServiceSpecificCredential;
