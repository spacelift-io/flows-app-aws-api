import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, ListInstanceProfilesCommand } from "@aws-sdk/client-iam";

const listInstanceProfiles: AppBlock = {
  name: "List Instance Profiles",
  description:
    "Lists the instance profiles that have the specified path prefix.",
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
        });

        const command = new ListInstanceProfilesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Instance Profiles Result",
      description: "Result from ListInstanceProfiles operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          InstanceProfiles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Path: {
                  type: "string",
                },
                InstanceProfileName: {
                  type: "string",
                },
                InstanceProfileId: {
                  type: "string",
                },
                Arn: {
                  type: "string",
                },
                CreateDate: {
                  type: "string",
                },
                Roles: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      Path: {
                        type: "object",
                        additionalProperties: true,
                      },
                      RoleName: {
                        type: "object",
                        additionalProperties: true,
                      },
                      RoleId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Arn: {
                        type: "object",
                        additionalProperties: true,
                      },
                      CreateDate: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AssumeRolePolicyDocument: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Description: {
                        type: "object",
                        additionalProperties: true,
                      },
                      MaxSessionDuration: {
                        type: "object",
                        additionalProperties: true,
                      },
                      PermissionsBoundary: {
                        type: "object",
                        additionalProperties: true,
                      },
                      Tags: {
                        type: "object",
                        additionalProperties: true,
                      },
                      RoleLastUsed: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: [
                      "Path",
                      "RoleName",
                      "RoleId",
                      "Arn",
                      "CreateDate",
                    ],
                    additionalProperties: false,
                  },
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
              required: [
                "Path",
                "InstanceProfileName",
                "InstanceProfileId",
                "Arn",
                "CreateDate",
                "Roles",
              ],
              additionalProperties: false,
            },
            description: "A list of instance profiles.",
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
        required: ["InstanceProfiles"],
      },
    },
  },
};

export default listInstanceProfiles;
