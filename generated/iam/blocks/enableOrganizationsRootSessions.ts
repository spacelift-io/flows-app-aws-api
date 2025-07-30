import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  EnableOrganizationsRootSessionsCommand,
} from "@aws-sdk/client-iam";

const enableOrganizationsRootSessions: AppBlock = {
  name: "Enable Organizations Root Sessions",
  description:
    "Allows the management account or delegated administrator to perform privileged tasks on member accounts in your organization.",
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
        });

        const command = new EnableOrganizationsRootSessionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Enable Organizations Root Sessions Result",
      description: "Result from EnableOrganizationsRootSessions operation",
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
              "The features you have enabled for centralized root access.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default enableOrganizationsRootSessions;
