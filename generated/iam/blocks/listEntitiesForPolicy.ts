import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, ListEntitiesForPolicyCommand } from "@aws-sdk/client-iam";

const listEntitiesForPolicy: AppBlock = {
  name: "List Entities For Policy",
  description:
    "Lists all IAM users, groups, and roles that the specified managed policy is attached to.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PolicyArn: {
          name: "Policy Arn",
          description:
            "The Amazon Resource Name (ARN) of the IAM policy for which you want the versions.",
          type: "string",
          required: true,
        },
        EntityFilter: {
          name: "Entity Filter",
          description: "The entity type to use for filtering the results.",
          type: "string",
          required: false,
        },
        PathPrefix: {
          name: "Path Prefix",
          description: "The path prefix for filtering the results.",
          type: "string",
          required: false,
        },
        PolicyUsageFilter: {
          name: "Policy Usage Filter",
          description:
            "The policy usage method to use for filtering the results.",
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

        const command = new ListEntitiesForPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Entities For Policy Result",
      description: "Result from ListEntitiesForPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PolicyGroups: {
            type: "array",
            items: {
              type: "object",
              properties: {
                GroupName: {
                  type: "string",
                },
                GroupId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of IAM groups that the policy is attached to.",
          },
          PolicyUsers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                UserName: {
                  type: "string",
                },
                UserId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of IAM users that the policy is attached to.",
          },
          PolicyRoles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                RoleName: {
                  type: "string",
                },
                RoleId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of IAM roles that the policy is attached to.",
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

export default listEntitiesForPolicy;
