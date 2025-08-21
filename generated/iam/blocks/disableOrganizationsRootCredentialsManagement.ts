import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  DisableOrganizationsRootCredentialsManagementCommand,
} from "@aws-sdk/client-iam";

const disableOrganizationsRootCredentialsManagement: AppBlock = {
  name: "Disable Organizations Root Credentials Management",
  description:
    "Disables the management of privileged root user credentials across member accounts in your organization.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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

        const command =
          new DisableOrganizationsRootCredentialsManagementCommand(
            commandInput as any,
          );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disable Organizations Root Credentials Management Result",
      description:
        "Result from DisableOrganizationsRootCredentialsManagement operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          OrganizationId: {
            type: "string",
            description: "The unique identifier (ID) of an organization.",
          },
          EnabledFeatures: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The features enabled for centralized root access for member accounts in your organization.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default disableOrganizationsRootCredentialsManagement;
