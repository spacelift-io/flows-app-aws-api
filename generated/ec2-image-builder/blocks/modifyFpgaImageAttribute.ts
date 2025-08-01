import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyFpgaImageAttributeCommand,
} from "@aws-sdk/client-ec2";

const modifyFpgaImageAttribute: AppBlock = {
  name: "Modify Fpga Image Attribute",
  description:
    "Modifies the specified attribute of the specified Amazon FPGA Image (AFI).",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        FpgaImageId: {
          name: "Fpga Image Id",
          description: "The ID of the AFI.",
          type: "string",
          required: true,
        },
        Attribute: {
          name: "Attribute",
          description: "The name of the attribute.",
          type: "string",
          required: false,
        },
        OperationType: {
          name: "Operation Type",
          description: "The operation type.",
          type: "string",
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
        ProductCodes: {
          name: "Product Codes",
          description: "The product codes.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        LoadPermission: {
          name: "Load Permission",
          description: "The load permission for the AFI.",
          type: {
            type: "object",
            properties: {
              Add: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Group: {
                      type: "string",
                    },
                    UserId: {
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
                    Group: {
                      type: "string",
                    },
                    UserId: {
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
        Description: {
          name: "Description",
          description: "A description for the AFI.",
          type: "string",
          required: false,
        },
        Name: {
          name: "Name",
          description: "A name for the AFI.",
          type: "string",
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
        });

        const command = new ModifyFpgaImageAttributeCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Fpga Image Attribute Result",
      description: "Result from ModifyFpgaImageAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FpgaImageAttribute: {
            type: "object",
            properties: {
              FpgaImageId: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              Description: {
                type: "string",
              },
              LoadPermissions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
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
              ProductCodes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ProductCodeId: {
                      type: "string",
                    },
                    ProductCodeType: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "Information about the attribute.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyFpgaImageAttribute;
