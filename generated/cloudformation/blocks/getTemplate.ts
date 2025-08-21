import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  GetTemplateCommand,
} from "@aws-sdk/client-cloudformation";

const getTemplate: AppBlock = {
  name: "Get Template",
  description: "Returns the template body for a specified stack.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        StackName: {
          name: "Stack Name",
          description:
            "The name or the unique stack ID that's associated with the stack, which aren't always interchangeable: Running stacks: You can specify either the stack's name or its unique stack ID.",
          type: "string",
          required: false,
        },
        ChangeSetName: {
          name: "Change Set Name",
          description:
            "The name or Amazon Resource Name (ARN) of a change set for which CloudFormation returns the associated template.",
          type: "string",
          required: false,
        },
        TemplateStage: {
          name: "Template Stage",
          description:
            "For templates that include transforms, the stage of the template that CloudFormation returns.",
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

        const command = new GetTemplateCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Template Result",
      description: "Result from GetTemplate operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TemplateBody: {
            type: "string",
            description: "Structure that contains the template body.",
          },
          StagesAvailable: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The stage of the template that you can retrieve.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getTemplate;
