import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeFpgaImageAttributeCommand,
} from "@aws-sdk/client-ec2";

const describeFpgaImageAttribute: AppBlock = {
  name: "Describe Fpga Image Attribute",
  description:
    "Describes the specified attribute of the specified Amazon FPGA Image (AFI).",
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
          description: "The AFI attribute.",
          type: "string",
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

        const command = new DescribeFpgaImageAttributeCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Fpga Image Attribute Result",
      description: "Result from DescribeFpgaImageAttribute operation",
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

export default describeFpgaImageAttribute;
