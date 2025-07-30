import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ImportVolumeCommand } from "@aws-sdk/client-ec2";

const importVolume: AppBlock = {
  name: "Import Volume",
  description: "This API action supports only single-volume VMs.",
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
        AvailabilityZone: {
          name: "Availability Zone",
          description: "The Availability Zone for the resulting EBS volume.",
          type: "string",
          required: true,
        },
        Image: {
          name: "Image",
          description: "The disk image.",
          type: {
            type: "object",
            properties: {
              Format: {
                type: "string",
              },
              Bytes: {
                type: "number",
              },
              ImportManifestUrl: {
                type: "string",
              },
            },
            required: ["Format", "Bytes", "ImportManifestUrl"],
            additionalProperties: false,
          },
          required: true,
        },
        Description: {
          name: "Description",
          description: "A description of the volume.",
          type: "string",
          required: false,
        },
        Volume: {
          name: "Volume",
          description: "The volume size.",
          type: {
            type: "object",
            properties: {
              Size: {
                type: "number",
              },
            },
            required: ["Size"],
            additionalProperties: false,
          },
          required: true,
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

        const command = new ImportVolumeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Import Volume Result",
      description: "Result from ImportVolume operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ConversionTask: {
            type: "object",
            properties: {
              ConversionTaskId: {
                type: "string",
              },
              ExpirationTime: {
                type: "string",
              },
              ImportInstance: {
                type: "object",
                properties: {
                  Description: {
                    type: "string",
                  },
                  InstanceId: {
                    type: "string",
                  },
                  Platform: {
                    type: "string",
                  },
                  Volumes: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        AvailabilityZone: {
                          type: "object",
                          additionalProperties: true,
                        },
                        BytesConverted: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Description: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Image: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Status: {
                          type: "object",
                          additionalProperties: true,
                        },
                        StatusMessage: {
                          type: "object",
                          additionalProperties: true,
                        },
                        Volume: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      additionalProperties: false,
                    },
                  },
                },
                additionalProperties: false,
              },
              ImportVolume: {
                type: "object",
                properties: {
                  AvailabilityZone: {
                    type: "string",
                  },
                  BytesConverted: {
                    type: "number",
                  },
                  Description: {
                    type: "string",
                  },
                  Image: {
                    type: "object",
                    properties: {
                      Checksum: {
                        type: "string",
                      },
                      Format: {
                        type: "string",
                      },
                      ImportManifestUrl: {
                        type: "string",
                      },
                      Size: {
                        type: "number",
                      },
                    },
                    additionalProperties: false,
                  },
                  Volume: {
                    type: "object",
                    properties: {
                      Id: {
                        type: "string",
                      },
                      Size: {
                        type: "number",
                      },
                    },
                    additionalProperties: false,
                  },
                },
                additionalProperties: false,
              },
              State: {
                type: "string",
              },
              StatusMessage: {
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
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "Information about the conversion task.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default importVolume;
