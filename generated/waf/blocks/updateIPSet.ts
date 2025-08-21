import { AppBlock, events } from "@slflows/sdk/v1";
import { WAFClient, UpdateIPSetCommand } from "@aws-sdk/client-waf";

const updateIPSet: AppBlock = {
  name: "Update IP Set",
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
        IPSetId: {
          name: "IP Set Id",
          description: "The IPSetId of the IPSet that you want to update.",
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
        Updates: {
          name: "Updates",
          description:
            "An array of IPSetUpdate objects that you want to insert into or delete from an IPSet.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Action: {
                  type: "string",
                },
                IPSetDescriptor: {
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
              required: ["Action", "IPSetDescriptor"],
              additionalProperties: false,
            },
          },
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new UpdateIPSetCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update IP Set Result",
      description: "Result from UpdateIPSet operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ChangeToken: {
            type: "string",
            description:
              "The ChangeToken that you used to submit the UpdateIPSet request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updateIPSet;
