import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifyImageAttributeCommand } from "@aws-sdk/client-ec2";

const modifyImageAttribute: AppBlock = {
  name: "Modify Image Attribute",
  description: "Modifies the specified attribute of the specified AMI.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Attribute: {
          name: "Attribute",
          description: "The name of the attribute to modify.",
          type: "string",
          required: false,
        },
        Description: {
          name: "Description",
          description: "A new description for the AMI.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        ImageId: {
          name: "Image Id",
          description: "The ID of the AMI.",
          type: "string",
          required: true,
        },
        LaunchPermission: {
          name: "Launch Permission",
          description: "A new launch permission for the AMI.",
          type: {
            type: "object",
            properties: {
              Add: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    OrganizationArn: {
                      type: "string",
                    },
                    OrganizationalUnitArn: {
                      type: "string",
                    },
                    UserId: {
                      type: "string",
                    },
                    Group: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              Remove: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    OrganizationArn: {
                      type: "string",
                    },
                    OrganizationalUnitArn: {
                      type: "string",
                    },
                    UserId: {
                      type: "string",
                    },
                    Group: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        OperationType: {
          name: "Operation Type",
          description: "The operation type.",
          type: "string",
          required: false,
        },
        ProductCodes: {
          name: "Product Codes",
          description: "Not supported.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        UserGroups: {
          name: "User Groups",
          description: "The user groups.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        UserIds: {
          name: "User Ids",
          description: "The Amazon Web Services account IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Value: {
          name: "Value",
          description: "The value of the attribute being modified.",
          type: "string",
          required: false,
        },
        OrganizationArns: {
          name: "Organization Arns",
          description: "The Amazon Resource Name (ARN) of an organization.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        OrganizationalUnitArns: {
          name: "Organizational Unit Arns",
          description:
            "The Amazon Resource Name (ARN) of an organizational unit (OU).",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        ImdsSupport: {
          name: "Imds Support",
          description: "Set to v2.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new ModifyImageAttributeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Image Attribute Result",
      description: "Result from ModifyImageAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default modifyImageAttribute;
