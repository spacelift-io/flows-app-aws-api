import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  EstimateTemplateCostCommand,
} from "@aws-sdk/client-cloudformation";

const estimateTemplateCost: AppBlock = {
  name: "Estimate Template Cost",
  description: "Returns the estimated monthly cost of a template.",
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
        Parameters: {
          name: "Parameters",
          description:
            "A list of Parameter structures that specify input parameters.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ParameterKey: {
                  type: "string",
                },
                ParameterValue: {
                  type: "string",
                },
                UsePreviousValue: {
                  type: "boolean",
                },
                ResolvedValue: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
          },
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
        });

        const command = new EstimateTemplateCostCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Estimate Template Cost Result",
      description: "Result from EstimateTemplateCost operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Url: {
            type: "string",
            description:
              "An Amazon Web Services Simple Monthly Calculator URL with a query string that describes the resources required to run the template.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default estimateTemplateCost;
