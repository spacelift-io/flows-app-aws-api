import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeSecurityGroupVpcAssociationsCommand,
} from "@aws-sdk/client-ec2";

const describeSecurityGroupVpcAssociations: AppBlock = {
  name: "Describe Security Group Vpc Associations",
  description:
    "Describes security group VPC associations made with AssociateSecurityGroupVpc.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Filters: {
          name: "Filters",
          description: "Security group VPC association filters.",
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
          description: "The token returned from a previous paginated request.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of items to return for this request.",
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

        const command = new DescribeSecurityGroupVpcAssociationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Security Group Vpc Associations Result",
      description: "Result from DescribeSecurityGroupVpcAssociations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SecurityGroupVpcAssociations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                GroupId: {
                  type: "string",
                },
                VpcId: {
                  type: "string",
                },
                VpcOwnerId: {
                  type: "string",
                },
                State: {
                  type: "string",
                },
                StateReason: {
                  type: "string",
                },
                GroupOwnerId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "The security group VPC associations.",
          },
          NextToken: {
            type: "string",
            description:
              "The token to include in another request to get the next page of items.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeSecurityGroupVpcAssociations;
