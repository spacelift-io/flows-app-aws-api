import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, CreateVirtualMFADeviceCommand } from "@aws-sdk/client-iam";

const createVirtualMFADevice: AppBlock = {
  name: "Create Virtual MFA Device",
  description:
    "Creates a new virtual MFA device for the Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Path: {
          name: "Path",
          description: "The path for the virtual MFA device.",
          type: "string",
          required: false,
        },
        VirtualMFADeviceName: {
          name: "Virtual MFA Device Name",
          description:
            "The name of the virtual MFA device, which must be unique.",
          type: "string",
          required: true,
        },
        Tags: {
          name: "Tags",
          description:
            "A list of tags that you want to attach to the new IAM virtual MFA device.",
          type: {
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

        const command = new CreateVirtualMFADeviceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Virtual MFA Device Result",
      description: "Result from CreateVirtualMFADevice operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VirtualMFADevice: {
            type: "object",
            properties: {
              SerialNumber: {
                type: "string",
              },
              Base32StringSeed: {
                type: "string",
              },
              QRCodePNG: {
                type: "string",
              },
              User: {
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
              EnableDate: {
                type: "string",
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
            },
            required: ["SerialNumber"],
            additionalProperties: false,
            description:
              "A structure containing details about the new virtual MFA device.",
          },
        },
        required: ["VirtualMFADevice"],
      },
    },
  },
};

export default createVirtualMFADevice;
