import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";

const sendRawEmail: AppBlock = {
  name: "Send Raw Email",
  description:
    "Composes an email message and immediately queues it for sending.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Source: {
          name: "Source",
          description: "The identity's email address.",
          type: "string",
          required: false,
        },
        Destinations: {
          name: "Destinations",
          description:
            "A list of destinations for the message, consisting of To:, CC:, and BCC: addresses.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        RawMessage: {
          name: "Raw Message",
          description: "The raw email message itself.",
          type: {
            type: "object",
            properties: {
              Data: {
                type: "string",
              },
            },
            required: ["Data"],
            additionalProperties: false,
          },
          required: true,
        },
        FromArn: {
          name: "From Arn",
          description: "This parameter is used only for sending authorization.",
          type: "string",
          required: false,
        },
        SourceArn: {
          name: "Source Arn",
          description: "This parameter is used only for sending authorization.",
          type: "string",
          required: false,
        },
        ReturnPathArn: {
          name: "Return Path Arn",
          description: "This parameter is used only for sending authorization.",
          type: "string",
          required: false,
        },
        Tags: {
          name: "Tags",
          description:
            "A list of tags, in the form of name/value pairs, to apply to an email that you send using SendRawEmail.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Name", "Value"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        ConfigurationSetName: {
          name: "Configuration Set Name",
          description:
            "The name of the configuration set to use when you send an email using SendRawEmail.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SESClient({
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

        const command = new SendRawEmailCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Send Raw Email Result",
      description: "Result from SendRawEmail operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          MessageId: {
            type: "string",
            description:
              "The unique message identifier returned from the SendRawEmail action.",
          },
        },
        required: ["MessageId"],
      },
    },
  },
};

export default sendRawEmail;
