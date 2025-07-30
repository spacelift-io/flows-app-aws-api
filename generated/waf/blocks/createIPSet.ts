import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, CreateIPSetCommand } from "@aws-sdk/client-waf";

const createIPSet: AppBlock = {
  name: "Create IP Set",
  description: "This is AWS WAF Classic documentation.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "A friendly name or description of the IPSet.",
          type: "string",
          required: true,
        },
        ChangeToken: {
          name: "Change Token",
          description:
            "The value returned by the most recent call to GetChangeToken.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new WAFClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new CreateIPSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create IP Set Result",
      description: "Result from CreateIPSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          IPSet: {
            type: "object",
            properties: {
              IPSetId: {
                type: "string",
              },
              Name: {
                type: "string",
              },
              IPSetDescriptors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Type: {
                      type: "string",
                    },
                    Value: {
                      type: "string",
                    },
                  },
                  required: ["Type", "Value"],
                  additionalProperties: false,
                },
              },
            },
            required: ["IPSetId", "IPSetDescriptors"],
            additionalProperties: false,
            description: "The IPSet returned in the CreateIPSet response.",
          },
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the CreateIPSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createIPSet;
