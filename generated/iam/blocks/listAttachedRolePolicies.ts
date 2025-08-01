import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  ListAttachedRolePoliciesCommand,
} from "@aws-sdk/client-iam";

const listAttachedRolePolicies: AppBlock = {
  name: "List Attached Role Policies",
  description:
    "Lists all managed policies that are attached to the specified IAM role.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RoleName: {
          name: "Role Name",
          description:
            "The name (friendly name, not ARN) of the role to list attached policies for.",
          type: "string",
          required: true,
        },
        PathPrefix: {
          name: "Path Prefix",
          description: "The path prefix for filtering the results.",
          type: "string",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "Use this only when paginating results to indicate the maximum number of items you want in the response.",
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

        const command = new ListAttachedRolePoliciesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Attached Role Policies Result",
      description: "Result from ListAttachedRolePolicies operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AttachedPolicies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                PolicyName: {
                  type: "string",
                },
                PolicyArn: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of the attached policies.",
          },
          IsTruncated: {
            type: "boolean",
            description:
              "A flag that indicates whether there are more items to return.",
          },
          Marker: {
            type: "string",
            description:
              "When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listAttachedRolePolicies;
