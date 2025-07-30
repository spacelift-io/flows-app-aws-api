import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, CreateServiceLinkedRoleCommand } from "@aws-sdk/client-iam";

const createServiceLinkedRole: AppBlock = {
  name: "Create Service Linked Role",
  description:
    "Creates an IAM role that is linked to a specific Amazon Web Services service.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AWSServiceName: {
          name: "AWS Service Name",
          description:
            "The service principal for the Amazon Web Services service to which this role is attached.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "The description of the role.",
          type: "string",
          required: false,
        },
        CustomSuffix: {
          name: "Custom Suffix",
          description:
            "A string that you provide, which is combined with the service-provided prefix to form the complete role name.",
          type: "string",
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

        const command = new CreateServiceLinkedRoleCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Service Linked Role Result",
      description: "Result from CreateServiceLinkedRole operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Role: {
            type: "object",
            properties: {
              Path: {
                type: "string",
              },
              RoleName: {
                type: "string",
              },
              RoleId: {
                type: "string",
              },
              Arn: {
                type: "string",
              },
              CreateDate: {
                type: "string",
              },
              AssumeRolePolicyDocument: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              MaxSessionDuration: {
                type: "number",
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
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  required: ["Key", "Value"],
                  additionalProperties: false,
                },
              },
              RoleLastUsed: {
                type: "object",
                properties: {
                  LastUsedDate: {
                    type: "string",
                  },
                  Region: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            required: ["Path", "RoleName", "RoleId", "Arn", "CreateDate"],
            additionalProperties: false,
            description:
              "A Role object that contains details about the newly created role.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createServiceLinkedRole;
