import { AppBlock, events } from "@slflows/sdk/v1";
import { EC2Client, DescribeLaunchTemplatesCommand } from "@aws-sdk/client-ec2";

const describeLaunchTemplates: AppBlock = {
  name: "Describe Launch Templates",
  description: "Describes one or more launch templates.",
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
        LaunchTemplateIds: {
          name: "Launch Template Ids",
          description: "One or more launch template IDs.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        LaunchTemplateNames: {
          name: "Launch Template Names",
          description: "One or more launch template names.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        Filters: {
          name: "Filters",
          description: "One or more filters.",
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
          description: "The token to request the next page of results.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to return in a single call.",
          type: "number",
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

        const command = new DescribeLaunchTemplatesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Launch Templates Result",
      description: "Result from DescribeLaunchTemplates operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          LaunchTemplates: {
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
                        type: "object",
                        additionalProperties: true,
                      },
                      Value: {
                        type: "object",
                        additionalProperties: true,
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
            },
            description: "Information about the launch templates.",
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

export default describeLaunchTemplates;
