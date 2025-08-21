import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DescribeOrganizationsAccessCommand,
} from "@aws-sdk/client-cloudformation";

const describeOrganizationsAccess: AppBlock = {
  name: "Describe Organizations Access",
  description:
    "Retrieves information about the account's OrganizationAccess status.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        CallAs: {
          name: "Call As",
          description:
            "[Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
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

        const command = new DescribeOrganizationsAccessCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Organizations Access Result",
      description: "Result from DescribeOrganizationsAccess operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Status: {
            type: "string",
            description: "Presents the status of the OrganizationAccess.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeOrganizationsAccess;
