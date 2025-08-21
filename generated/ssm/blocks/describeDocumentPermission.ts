import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DescribeDocumentPermissionCommand,
} from "@aws-sdk/client-ssm";

const describeDocumentPermission: AppBlock = {
  name: "Describe Document Permission",
  description:
    "Describes the permissions for a Amazon Web Services Systems Manager document (SSM document).",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name of the document for which you are the owner.",
          type: "string",
          required: true,
        },
        PermissionType: {
          name: "Permission Type",
          description: "The permission type for the document.",
          type: "string",
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
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

        const command = new DescribeDocumentPermissionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Document Permission Result",
      description: "Result from DescribeDocumentPermission operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AccountIds: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The account IDs that have permission to use this document.",
          },
          AccountSharingInfoList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                AccountId: {
                  type: "string",
                },
                SharedDocumentVersion: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "A list of Amazon Web Services accounts where the current document is shared and the version shared with each account.",
          },
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeDocumentPermission;
