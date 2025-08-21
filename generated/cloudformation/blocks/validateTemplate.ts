import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ValidateTemplateCommand,
} from "@aws-sdk/client-cloudformation";

const validateTemplate: AppBlock = {
  name: "Validate Template",
  description: "Validates a specified template.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TemplateBody: {
          name: "Template Body",
          description:
            "Structure that contains the template body with a minimum length of 1 byte and a maximum length of 51,200 bytes.",
          type: "string",
          required: false,
        },
        TemplateURL: {
          name: "Template URL",
          description: "The URL of a file that contains the template body.",
          type: "string",
          required: false,
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

        const command = new ValidateTemplateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Validate Template Result",
      description: "Result from ValidateTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Parameters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ParameterKey: {
                  type: "string",
                },
                DefaultValue: {
                  type: "string",
                },
                NoEcho: {
                  type: "boolean",
                },
                Description: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of TemplateParameter structures.",
          },
          Description: {
            type: "string",
            description: "The description found within the template.",
          },
          Capabilities: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The capabilities found within the template.",
          },
          CapabilitiesReason: {
            type: "string",
            description:
              "The list of resources that generated the values in the Capabilities response element.",
          },
          DeclaredTransforms: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of the transforms that are declared in the template.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default validateTemplate;
