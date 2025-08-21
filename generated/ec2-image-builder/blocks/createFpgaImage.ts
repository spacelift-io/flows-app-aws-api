import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, CreateFpgaImageCommand } from "@aws-sdk/client-ec2";

const createFpgaImage: AppBlock = {
  name: "Create Fpga Image",
  description:
    "Creates an Amazon FPGA Image (AFI) from the specified design checkpoint (DCP).",
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
        InputStorageLocation: {
          name: "Input Storage Location",
          description:
            "The location of the encrypted design checkpoint in Amazon S3.",
          type: {
            type: "object",
            properties: {
              Bucket: {
                type: "string",
              },
              Key: {
                type: "string",
              },
            },
            additionalProperties: false,
          },
          required: true,
        },
        LogsStorageLocation: {
          name: "Logs Storage Location",
          description: "The location in Amazon S3 for the output logs.",
          type: {
            type: "object",
            properties: {
              Bucket: {
                type: "string",
              },
              Key: {
                type: "string",
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
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        TagSpecifications: {
          name: "Tag Specifications",
          description: "The tags to apply to the FPGA image during creation.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ResourceType: {
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
                    additionalProperties: false,
                  },
                },
              },
              additionalProperties: false,
            },
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateFpgaImageCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Fpga Image Result",
      description: "Result from CreateFpgaImage operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FpgaImageId: {
            type: "string",
            description: "The FPGA image identifier (AFI ID).",
          },
          FpgaImageGlobalId: {
            type: "string",
            description: "The global FPGA image identifier (AGFI ID).",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createFpgaImage;
