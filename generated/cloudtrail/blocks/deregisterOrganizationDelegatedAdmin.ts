import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  DeregisterOrganizationDelegatedAdminCommand,
} from "@aws-sdk/client-cloudtrail";

const deregisterOrganizationDelegatedAdmin: AppBlock = {
  name: "Deregister Organization Delegated Admin",
  description:
    "Removes CloudTrail delegated administrator permissions from a member account in an organization.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DelegatedAdminAccountId: {
          name: "Delegated Admin Account Id",
          description: "A delegated administrator account ID.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudTrailClient({
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

        const command = new DeregisterOrganizationDelegatedAdminCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Deregister Organization Delegated Admin Result",
      description: "Result from DeregisterOrganizationDelegatedAdmin operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deregisterOrganizationDelegatedAdmin;
