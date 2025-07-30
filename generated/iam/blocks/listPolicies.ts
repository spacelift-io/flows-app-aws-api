import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, ListPoliciesCommand } from "@aws-sdk/client-iam";

const listPolicies: AppBlock = {
  name: "List Policies",
  description:
    "Lists all the managed policies that are available in your Amazon Web Services account, including your own customer-defined managed policies and all Amazon Web Services managed policies.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Scope: {
          name: "Scope",
          description: "The scope to use for filtering the results.",
          type: "string",
          required: false,
        },
        OnlyAttached: {
          name: "Only Attached",
          description:
            "A flag to filter the results to only the attached policies.",
          type: "boolean",
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

        const command = new ListPoliciesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Policies Result",
      description: "Result from ListPolicies operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Policies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                PolicyName: {
                  type: "string",
                },
                PolicyId: {
                  type: "string",
                },
                Arn: {
                  type: "string",
                },
                Path: {
                  type: "string",
                },
                DefaultVersionId: {
                  type: "string",
                },
                AttachmentCount: {
                  type: "number",
                },
                PermissionsBoundaryUsageCount: {
                  type: "number",
                },
                IsAttachable: {
                  type: "boolean",
                },
                Description: {
                  type: "string",
                },
                CreateDate: {
                  type: "string",
                },
                UpdateDate: {
                  type: "string",
                },
                Tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Key: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: ["Key", "Value"],
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
            description: "A list of policies.",
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

export default listPolicies;
