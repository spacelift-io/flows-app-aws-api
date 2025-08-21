import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifySecurityGroupRulesCommand,
} from "@aws-sdk/client-ec2";

const modifySecurityGroupRules: AppBlock = {
  name: "Modify Security Group Rules",
  description: "Modifies the rules of a security group.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        GroupId: {
          name: "Group Id",
          description: "The ID of the security group.",
          type: "string",
          required: true,
        },
        SecurityGroupRules: {
          name: "Security Group Rules",
          description:
            "Information about the security group properties to update.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SecurityGroupRuleId: {
                  type: "string",
                },
                SecurityGroupRule: {
                  type: "object",
                  properties: {
                    IpProtocol: {
                      type: "string",
                    },
                    FromPort: {
                      type: "number",
                    },
                    ToPort: {
                      type: "number",
                    },
                    CidrIpv4: {
                      type: "string",
                    },
                    CidrIpv6: {
                      type: "string",
                    },
                    PrefixListId: {
                      type: "string",
                    },
                    ReferencedGroupId: {
                      type: "string",
                    },
                    Description: {
                      type: "string",
                    },
                  },
                  additionalProperties: false,
                },
              },
              required: ["SecurityGroupRuleId"],
              additionalProperties: false,
            },
          },
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new ModifySecurityGroupRulesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Security Group Rules Result",
      description: "Result from ModifySecurityGroupRules operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description:
              "Returns true if the request succeeds; otherwise, returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifySecurityGroupRules;
