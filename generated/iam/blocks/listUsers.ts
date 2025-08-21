import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, ListUsersCommand } from "@aws-sdk/client-iam";

const listUsers: AppBlock = {
  name: "List Users",
  description: "Lists the IAM users that have the specified path prefix.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ListUsersCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Users Result",
      description: "Result from ListUsers operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Users: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Path: {
                  type: "string",
                },
                UserName: {
                  type: "string",
                },
                UserId: {
                  type: "string",
                },
                Arn: {
                  type: "string",
                },
                CreateDate: {
                  type: "string",
                },
                PasswordLastUsed: {
                  type: "string",
                },
                PermissionsBoundary: {
                  type: "object",
                  properties: {
                    PermissionsBoundaryType: {
                      type: "string",
                    },
                    PermissionsBoundaryArn: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
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
              required: ["Path", "UserName", "UserId", "Arn", "CreateDate"],
              additionalProperties: false,
            },
            description: "A list of users.",
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
        required: ["Users"],
      },
    },
  },
};

export default listUsers;
