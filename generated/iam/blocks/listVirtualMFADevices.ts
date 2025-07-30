import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, ListVirtualMFADevicesCommand } from "@aws-sdk/client-iam";

const listVirtualMFADevices: AppBlock = {
  name: "List Virtual MFA Devices",
  description:
    "Lists the virtual MFA devices defined in the Amazon Web Services account by assignment status.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AssignmentStatus: {
          name: "Assignment Status",
          description:
            "The status (Unassigned or Assigned) of the devices to list.",
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

        const command = new ListVirtualMFADevicesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Virtual MFA Devices Result",
      description: "Result from ListVirtualMFADevices operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VirtualMFADevices: {
            type: "array",
            items: {
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
                          type: "object",
                          additionalProperties: true,
                        },
                        PermissionsBoundaryArn: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                    Tags: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
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
              required: ["SerialNumber"],
              additionalProperties: false,
            },
            description:
              "The list of virtual MFA devices in the current account that match the AssignmentStatus value that was passed in the request.",
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
        required: ["VirtualMFADevices"],
      },
    },
  },
};

export default listVirtualMFADevices;
