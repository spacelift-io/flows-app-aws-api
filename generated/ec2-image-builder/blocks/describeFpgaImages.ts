import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeFpgaImagesCommand } from "@aws-sdk/client-ec2";

const describeFpgaImages: AppBlock = {
  name: "Describe Fpga Images",
  description: "Describes the Amazon FPGA Images (AFIs) available to you.",
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
        FpgaImageIds: {
          name: "Fpga Image Ids",
          description: "The AFI IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Owners: {
          name: "Owners",
          description: "Filters the AFI by owner.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "The filters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Values: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token to retrieve the next page of results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return in a single call.",
          type: "number",
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

        const command = new DescribeFpgaImagesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Fpga Images Result",
      description: "Result from DescribeFpgaImages operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          FpgaImages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                FpgaImageId: {
                  type: "string",
                },
                FpgaImageGlobalId: {
                  type: "string",
                },
                Name: {
                  type: "string",
                },
                Description: {
                  type: "string",
                },
                ShellVersion: {
                  type: "string",
                },
                PciId: {
                  type: "object",
                  properties: {
                    DeviceId: {
                      type: "string",
                    },
                    VendorId: {
                      type: "string",
                    },
                    SubsystemId: {
                      type: "string",
                    },
                    SubsystemVendorId: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                State: {
                  type: "object",
                  properties: {
                    Code: {
                      type: "string",
                    },
                    Message: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
                CreateTime: {
                  type: "string",
                },
                UpdateTime: {
                  type: "string",
                },
                OwnerId: {
                  type: "string",
                },
                OwnerAlias: {
                  type: "string",
                },
                ProductCodes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ProductCodeId: {
                        type: "object",
                        additionalProperties: true,
                      },
                      ProductCodeType: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
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
                    additionalProperties: false,
                  },
                },
                Public: {
                  type: "boolean",
                },
                DataRetentionSupport: {
                  type: "boolean",
                },
                InstanceTypes: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description: "Information about the FPGA images.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to use to retrieve the next page of results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeFpgaImages;
