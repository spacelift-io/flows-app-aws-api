import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, ModifyLaunchTemplateCommand } from "@aws-sdk/client-ec2";

const modifyLaunchTemplate: AppBlock = {
  name: "Modify Launch Template",
  description: "Modifies a launch template.",
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
        ClientToken: {
          name: "Client Token",
          description:
            "Unique, case-sensitive identifier you provide to ensure the idempotency of the request.",
          type: "string",
          required: false,
        },
        LaunchTemplateId: {
          name: "Launch Template Id",
          description: "The ID of the launch template.",
          type: "string",
          required: false,
        },
        LaunchTemplateName: {
          name: "Launch Template Name",
          description: "The name of the launch template.",
          type: "string",
          required: false,
        },
        DefaultVersion: {
          name: "Default Version",
          description:
            "The version number of the launch template to set as the default version.",
          type: "string",
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

        const command = new ModifyLaunchTemplateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Launch Template Result",
      description: "Result from ModifyLaunchTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          LaunchTemplate: {
            type: "object",
            properties: {
              LaunchTemplateId: {
                type: "string",
              },
              LaunchTemplateName: {
                type: "string",
              },
              CreateTime: {
                type: "string",
              },
              CreatedBy: {
                type: "string",
              },
              DefaultVersionNumber: {
                type: "number",
              },
              LatestVersionNumber: {
                type: "number",
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
                  additionalProperties: false,
                },
              },
              Operator: {
                type: "object",
                properties: {
                  Managed: {
                    type: "boolean",
                  },
                  Principal: {
                    type: "string",
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
            description: "Information about the launch template.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyLaunchTemplate;
