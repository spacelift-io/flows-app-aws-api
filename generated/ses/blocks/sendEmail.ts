import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sendEmail: AppBlock = {
  name: "Send Email",
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
          description: "The email address that is sending the email.",
          type: "string",
          required: true,
        },
        Destination: {
          name: "Destination",
          description:
            "The destination for this email, composed of To:, CC:, and BCC: fields.",
          type: {
            type: "object",
            properties: {
              ToAddresses: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              CcAddresses: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              BccAddresses: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            additionalProperties: false,
          },
          required: true,
        },
        Message: {
          name: "Message",
          description: "The message to be sent.",
          type: {
            type: "object",
            properties: {
              Subject: {
                type: "object",
                properties: {
                  Data: {
                    type: "string",
                  },
                  Charset: {
                    type: "string",
                  },
                },
                required: ["Data"],
                additionalProperties: false,
              },
              Body: {
                type: "object",
                properties: {
                  Text: {
                    type: "object",
                    properties: {
                      Data: {
                        type: "string",
                      },
                      Charset: {
                        type: "string",
                      },
                    },
                    required: ["Data"],
                    additionalProperties: false,
                  },
                  Html: {
                    type: "object",
                    properties: {
                      Data: {
                        type: "string",
                      },
                      Charset: {
                        type: "string",
                      },
                    },
                    required: ["Data"],
                    additionalProperties: false,
                  },
                },
                additionalProperties: false,
              },
            },
            required: ["Subject", "Body"],
            additionalProperties: false,
          },
          required: true,
        },
        ReplyToAddresses: {
          name: "Reply To Addresses",
          description: "The reply-to email address(es) for the message.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        ReturnPath: {
          name: "Return Path",
          description:
            "The email address that bounces and complaints are forwarded to when feedback forwarding is enabled.",
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
            "A list of tags, in the form of name/value pairs, to apply to an email that you send using SendEmail.",
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
            "The name of the configuration set to use when you send an email using SendEmail.",
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
        });

        const command = new SendEmailCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Send Email Result",
      description: "Result from SendEmail operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          MessageId: {
            type: "string",
            description:
              "The unique message identifier returned from the SendEmail action.",
          },
        },
        required: ["MessageId"],
      },
    },
  },
};

export default sendEmail;
