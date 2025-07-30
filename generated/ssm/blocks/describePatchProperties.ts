import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DescribePatchPropertiesCommand } from "@aws-sdk/client-ssm";

const describePatchProperties: AppBlock = {
  name: "Describe Patch Properties",
  description:
    "Lists the properties of available patches organized by product, product family, classification, severity, and other properties of available patches.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OperatingSystem: {
          name: "Operating System",
          description: "The operating system type for which to list patches.",
          type: "string",
          required: true,
        },
        Property: {
          name: "Property",
          description:
            "The patch property for which you want to view patch details.",
          type: "string",
          required: true,
        },
        PatchSet: {
          name: "Patch Set",
          description:
            "Indicates whether to list patches for the Windows operating system or for applications released by Microsoft.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description: "The token for the next set of items to return.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new DescribePatchPropertiesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Patch Properties Result",
      description: "Result from DescribePatchProperties operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Properties: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: {
                type: "string",
              },
            },
            description:
              "A list of the properties for patches matching the filter request parameters.",
          },
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describePatchProperties;
