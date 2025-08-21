import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  CreateStackRefactorCommand,
} from "@aws-sdk/client-cloudformation";

const createStackRefactor: AppBlock = {
  name: "Create Stack Refactor",
  description:
    "Creates a refactor across multiple stacks, with the list of stacks and resources that are affected.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description: "A description to help you identify the stack refactor.",
          type: "string",
          required: false,
        },
        EnableStackCreation: {
          name: "Enable Stack Creation",
          description:
            "Determines if a new stack is created with the refactor.",
          type: "boolean",
          required: false,
        },
        ResourceMappings: {
          name: "Resource Mappings",
          description:
            "The mappings for the stack resource Source and stack resource Destination.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Source: {
                  type: "object",
                  properties: {
                    StackName: {
                      type: "string",
                    },
                    LogicalResourceId: {
                      type: "string",
                    },
                  },
                  required: ["StackName", "LogicalResourceId"],
                  additionalProperties: false,
                },
                Destination: {
                  type: "object",
                  properties: {
                    StackName: {
                      type: "string",
                    },
                    LogicalResourceId: {
                      type: "string",
                    },
                  },
                  required: ["StackName", "LogicalResourceId"],
                  additionalProperties: false,
                },
              },
              required: ["Source", "Destination"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        StackDefinitions: {
          name: "Stack Definitions",
          description: "The stacks being refactored.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                StackName: {
                  type: "string",
                },
                TemplateBody: {
                  type: "string",
                },
                TemplateURL: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
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

        const command = new CreateStackRefactorCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Stack Refactor Result",
      description: "Result from CreateStackRefactor operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          StackRefactorId: {
            type: "string",
            description:
              "The ID associated with the stack refactor created from the CreateStackRefactor action.",
          },
        },
        required: ["StackRefactorId"],
      },
    },
  },
};

export default createStackRefactor;
