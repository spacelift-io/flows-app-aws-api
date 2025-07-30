import { AppBlock, events } from "@slflows/sdk/v1";
import { EKSClient, AssociateAccessPolicyCommand } from "@aws-sdk/client-eks";

const associateAccessPolicy: AppBlock = {
  name: "Associate Access Policy",
  description: "Associates an access policy and its scope to an access entry.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        clusterName: {
          name: "cluster Name",
          description: "The name of your cluster.",
          type: "string",
          required: true,
        },
        principalArn: {
          name: "principal Arn",
          description:
            "The Amazon Resource Name (ARN) of the IAM user or role for the AccessEntry that you're associating the access policy to.",
          type: "string",
          required: true,
        },
        policyArn: {
          name: "policy Arn",
          description: "The ARN of the AccessPolicy that you're associating.",
          type: "string",
          required: true,
        },
        accessScope: {
          name: "access Scope",
          description: "The scope for the AccessPolicy.",
          type: {
            type: "object",
            properties: {
              type: {
                type: "string",
              },
              namespaces: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EKSClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new AssociateAccessPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Access Policy Result",
      description: "Result from AssociateAccessPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          clusterName: {
            type: "string",
            description: "The name of your cluster.",
          },
          principalArn: {
            type: "string",
            description: "The ARN of the IAM principal for the AccessEntry.",
          },
          associatedAccessPolicy: {
            type: "object",
            properties: {
              policyArn: {
                type: "string",
              },
              accessScope: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                  },
                  namespaces: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
                additionalProperties: false,
              },
              associatedAt: {
                type: "string",
              },
              modifiedAt: {
                type: "string",
              },
            },
            additionalProperties: false,
            description:
              "The AccessPolicy and scope associated to the AccessEntry.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default associateAccessPolicy;
