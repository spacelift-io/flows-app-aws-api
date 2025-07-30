import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DescribeSecurityGroupReferencesCommand,
} from "@aws-sdk/client-ec2";

const describeSecurityGroupReferences: AppBlock = {
  name: "Describe Security Group References",
  description:
    "Describes the VPCs on the other side of a VPC peering or Transit Gateway connection that are referencing the security groups you've specified in this request.",
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
        GroupId: {
          name: "Group Id",
          description: "The IDs of the security groups in your account.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
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

        const command = new DescribeSecurityGroupReferencesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Security Group References Result",
      description: "Result from DescribeSecurityGroupReferences operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SecurityGroupReferenceSet: {
            type: "array",
            items: {
              type: "object",
              properties: {
                GroupId: {
                  type: "string",
                },
                ReferencingVpcId: {
                  type: "string",
                },
                VpcPeeringConnectionId: {
                  type: "string",
                },
                TransitGatewayId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the VPCs with the referencing security groups.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeSecurityGroupReferences;
