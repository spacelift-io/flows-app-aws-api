import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EKSClient,
  DescribeAddonConfigurationCommand,
} from "@aws-sdk/client-eks";

const describeAddonConfiguration: AppBlock = {
  name: "Describe Addon Configuration",
  description: "Returns configuration options.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        addonName: {
          name: "addon Name",
          description: "The name of the add-on.",
          type: "string",
          required: true,
        },
        addonVersion: {
          name: "addon Version",
          description: "The version of the add-on.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EKSClient({
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

        const command = new DescribeAddonConfigurationCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Addon Configuration Result",
      description: "Result from DescribeAddonConfiguration operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          addonName: {
            type: "string",
            description: "The name of the add-on.",
          },
          addonVersion: {
            type: "string",
            description: "The version of the add-on.",
          },
          configurationSchema: {
            type: "string",
            description:
              "A JSON schema that's used to validate the configuration values you provide when an add-on is created or updated.",
          },
          podIdentityConfiguration: {
            type: "array",
            items: {
              type: "object",
              properties: {
                serviceAccount: {
                  type: "string",
                },
                recommendedManagedPolicies: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "The Kubernetes service account name used by the add-on, and any suggested IAM policies.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeAddonConfiguration;
