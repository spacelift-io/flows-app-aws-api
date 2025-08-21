import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  DeleteLaunchTemplateVersionsCommand,
} from "@aws-sdk/client-ec2";

const deleteLaunchTemplateVersions: AppBlock = {
  name: "Delete Launch Template Versions",
  description: "Deletes one or more versions of a launch template.",
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
        Versions: {
          name: "Versions",
          description:
            "The version numbers of one or more launch template versions to delete.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new DeleteLaunchTemplateVersionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Launch Template Versions Result",
      description: "Result from DeleteLaunchTemplateVersions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          SuccessfullyDeletedLaunchTemplateVersions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                LaunchTemplateId: {
                  type: "string",
                },
                LaunchTemplateName: {
                  type: "string",
                },
                VersionNumber: {
                  type: "number",
                },
              },
              additionalProperties: false,
            },
            description:
              "Information about the launch template versions that were successfully deleted.",
          },
          UnsuccessfullyDeletedLaunchTemplateVersions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                LaunchTemplateId: {
                  type: "string",
                },
                LaunchTemplateName: {
                  type: "string",
                },
                VersionNumber: {
                  type: "number",
                },
                ResponseError: {
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
              },
              additionalProperties: false,
            },
            description:
              "Information about the launch template versions that could not be deleted.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default deleteLaunchTemplateVersions;
