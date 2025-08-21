import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifyAddressAttributeCommand } from "@aws-sdk/client-ec2";

const modifyAddressAttribute: AppBlock = {
  name: "Modify Address Attribute",
  description: "Modifies an attribute of the specified Elastic IP address.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AllocationId: {
          name: "Allocation Id",
          description: "[EC2-VPC] The allocation ID.",
          type: "string",
          required: true,
        },
        DomainName: {
          name: "Domain Name",
          description: "The domain name to modify for the IP address.",
          type: "string",
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

        const command = new ModifyAddressAttributeCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Address Attribute Result",
      description: "Result from ModifyAddressAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Address: {
            type: "object",
            properties: {
              PublicIp: {
                type: "string",
              },
              AllocationId: {
                type: "string",
              },
              PtrRecord: {
                type: "string",
              },
              PtrRecordUpdate: {
                type: "object",
                properties: {
                  Value: {
                    type: "string",
                  },
                  Status: {
                    type: "string",
                  },
                  Reason: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description: "Information about the Elastic IP address.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyAddressAttribute;
