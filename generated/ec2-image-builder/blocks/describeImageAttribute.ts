import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeImageAttributeCommand } from "@aws-sdk/client-ec2";

const describeImageAttribute: AppBlock = {
  name: "Describe Image Attribute",
  description: "Describes the specified attribute of the specified AMI.",
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
          description: "The AMI attribute.",
          type: "string",
          required: true,
        },
        ImageId: {
          name: "Image Id",
          description: "The ID of the AMI.",
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

        const command = new DescribeImageAttributeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Image Attribute Result",
      description: "Result from DescribeImageAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Description: {
            type: "object",
            properties: {
              Value: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "A description for the AMI.",
          },
          KernelId: {
            type: "object",
            properties: {
              Value: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The kernel ID.",
          },
          RamdiskId: {
            type: "object",
            properties: {
              Value: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The RAM disk ID.",
          },
          SriovNetSupport: {
            type: "object",
            properties: {
              Value: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Indicates whether enhanced networking with the Intel 82599 Virtual Function interface is enabled.",
          },
          BootMode: {
            type: "object",
            properties: {
              Value: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "The boot mode.",
          },
          TpmSupport: {
            type: "object",
            properties: {
              Value: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "If the image is configured for NitroTPM support, the value is v2.",
          },
          UefiData: {
            type: "object",
            properties: {
              Value: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Base64 representation of the non-volatile UEFI variable store.",
          },
          LastLaunchedTime: {
            type: "object",
            properties: {
              Value: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The date and time, in ISO 8601 date-time format, when the AMI was last used to launch an EC2 instance.",
          },
          ImdsSupport: {
            type: "object",
            properties: {
              Value: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "If v2.",
          },
          DeregistrationProtection: {
            type: "object",
            properties: {
              Value: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "Indicates whether deregistration protection is enabled for the AMI.",
          },
          ImageId: {
            type: "string",
            description: "The ID of the AMI.",
          },
          LaunchPermissions: {
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
            description: "The launch permissions.",
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
            description: "The product codes.",
          },
          BlockDeviceMappings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Ebs: {
                  type: "object",
                  properties: {
                    DeleteOnTermination: {
                      type: "boolean",
                    },
                    Iops: {
                      type: "number",
                    },
                    SnapshotId: {
                      type: "string",
                    },
                    VolumeSize: {
                      type: "number",
                    },
                    VolumeType: {
                      type: "string",
                    },
                    KmsKeyId: {
                      type: "string",
                    },
                    Throughput: {
                      type: "number",
                    },
                    OutpostArn: {
                      type: "string",
                    },
                    AvailabilityZone: {
                      type: "string",
                    },
                    Encrypted: {
                      type: "boolean",
                    },
                    VolumeInitializationRate: {
                      type: "number",
                    },
                    AvailabilityZoneId: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                NoDevice: {
                  type: "string",
                },
                DeviceName: {
                  type: "string",
                },
                VirtualName: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The block device mapping entries.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeImageAttribute;
