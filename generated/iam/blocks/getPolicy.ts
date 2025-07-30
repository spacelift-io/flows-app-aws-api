import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, GetPolicyCommand } from "@aws-sdk/client-iam";

const getPolicy: AppBlock = {
  name: "Get Policy",
  description:
    "Retrieves information about the specified managed policy, including the policy's default version and the total number of IAM users, groups, and roles to which the policy is attached.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        PolicyArn: {
          name: "Policy Arn",
          description:
            "The Amazon Resource Name (ARN) of the managed policy that you want information about.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Policy Result",
      description: "Result from GetPolicy operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Policy: {
            type: "object",
            properties: {
              PolicyName: {
                type: "string",
              },
              PolicyId: {
                type: "string",
              },
              Arn: {
                type: "string",
              },
              Path: {
                type: "string",
              },
              DefaultVersionId: {
                type: "string",
              },
              AttachmentCount: {
                type: "number",
              },
              PermissionsBoundaryUsageCount: {
                type: "number",
              },
              IsAttachable: {
                type: "boolean",
              },
              Description: {
                type: "string",
              },
              CreateDate: {
                type: "string",
              },
              UpdateDate: {
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
                  required: ["Key", "Value"],
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description: "A structure containing details about the policy.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getPolicy;
