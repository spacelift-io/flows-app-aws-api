import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudTrailClient,
  RegisterOrganizationDelegatedAdminCommand,
} from "@aws-sdk/client-cloudtrail";

const registerOrganizationDelegatedAdmin: AppBlock = {
  name: "Register Organization Delegated Admin",
  description:
    "Registers an organization’s member account as the CloudTrail delegated administrator.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        MemberAccountId: {
          name: "Member Account Id",
          description:
            "An organization member account ID that you want to designate as a delegated administrator.",
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
        });

        const command = new RegisterOrganizationDelegatedAdminCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Register Organization Delegated Admin Result",
      description: "Result from RegisterOrganizationDelegatedAdmin operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default registerOrganizationDelegatedAdmin;
