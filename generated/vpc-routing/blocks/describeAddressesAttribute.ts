import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeAddressesAttributeCommand,
} from "@aws-sdk/client-ec2";

const describeAddressesAttribute: AppBlock = {
  name: "Describe Addresses Attribute",
  description:
    "Describes the attributes of the specified Elastic IP addresses.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AllocationIds: {
          name: "Allocation Ids",
          description: "[EC2-VPC] The allocation IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Attribute: {
          name: "Attribute",
          description: "The attribute of the IP address.",
          type: "string",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next page of results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return with a single call.",
          type: "number",
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

        const command = new DescribeAddressesAttributeCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Addresses Attribute Result",
      description: "Result from DescribeAddressesAttribute operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Addresses: {
            type: "array",
            items: {
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
            },
            description: "Information about the IP addresses.",
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

export default describeAddressesAttribute;
