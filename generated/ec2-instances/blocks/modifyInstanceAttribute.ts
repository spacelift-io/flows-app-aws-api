import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifyInstanceAttributeCommand } from "@aws-sdk/client-ec2";

const modifyInstanceAttribute: AppBlock = {
  name: "Modify Instance Attribute",
  description: "Modifies the specified attribute of the specified instance.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        SourceDestCheck: {
          name: "Source Dest Check",
          description:
            "Enable or disable source/destination checks, which ensure that the instance is either the source or the destination of any traffic that it receives.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        DisableApiStop: {
          name: "Disable Api Stop",
          description:
            "Indicates whether an instance is enabled for stop protection.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the operation, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The ID of the instance.",
          type: "string",
          required: true,
        },
        Attribute: {
          name: "Attribute",
          description: "The name of the attribute to modify.",
          type: "string",
          required: false,
        },
        Value: {
          name: "Value",
          description: "A new value for the attribute.",
          type: "string",
          required: false,
        },
        BlockDeviceMappings: {
          name: "Block Device Mappings",
          description:
            "Modifies the DeleteOnTermination attribute for volumes that are currently attached.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DeviceName: {
                  type: "string",
                },
                Ebs: {
                  type: "object",
                  properties: {
                    VolumeId: {
                      type: "string",
                    },
                    DeleteOnTermination: {
                      type: "boolean",
                    },
                  },
                  additionalProperties: false,
                },
                VirtualName: {
                  type: "string",
                },
                NoDevice: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        DisableApiTermination: {
          name: "Disable Api Termination",
          description:
            "Enable or disable termination protection for the instance.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        InstanceType: {
          name: "Instance Type",
          description: "Changes the instance type to the specified value.",
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
        Kernel: {
          name: "Kernel",
          description: "Changes the instance's kernel to the specified value.",
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
        Ramdisk: {
          name: "Ramdisk",
          description:
            "Changes the instance's RAM disk to the specified value.",
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
        UserData: {
          name: "User Data",
          description:
            "Changes the instance's user data to the specified value.",
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
        InstanceInitiatedShutdownBehavior: {
          name: "Instance Initiated Shutdown Behavior",
          description:
            "Specifies whether an instance stops or terminates when you initiate shutdown from the instance (using the operating system command for system shutdown).",
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
        Groups: {
          name: "Groups",
          description:
            "Replaces the security groups of the instance with the specified security groups.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        EbsOptimized: {
          name: "Ebs Optimized",
          description:
            "Specifies whether the instance is optimized for Amazon EBS I/O.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          required: false,
        },
        SriovNetSupport: {
          name: "Sriov Net Support",
          description:
            "Set to simple to enable enhanced networking with the Intel 82599 Virtual Function interface for the instance.",
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
        EnaSupport: {
          name: "Ena Support",
          description:
            "Set to true to enable enhanced networking with ENA for the instance.",
          type: {
            type: "object",
            properties: {
              Value: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
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

        const command = new ModifyInstanceAttributeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Instance Attribute Result",
      description: "Result from ModifyInstanceAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        additionalProperties: true,
      },
    },
  },
};

export default modifyInstanceAttribute;
