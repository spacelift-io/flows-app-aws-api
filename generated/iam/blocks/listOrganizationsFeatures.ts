import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  ListOrganizationsFeaturesCommand,
} from "@aws-sdk/client-iam";

const listOrganizationsFeatures: AppBlock = {
  name: "List Organizations Features",
  description:
    "Lists the centralized root access features enabled for your organization.",
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

        const command = new ListOrganizationsFeaturesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Organizations Features Result",
      description: "Result from ListOrganizationsFeatures operation",
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
              "Specifies the features that are currently available in your organization.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listOrganizationsFeatures;
