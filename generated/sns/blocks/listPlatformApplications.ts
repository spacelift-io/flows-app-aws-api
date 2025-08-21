import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SNSClient,
  ListPlatformApplicationsCommand,
} from "@aws-sdk/client-sns";

const listPlatformApplications: AppBlock = {
  name: "List Platform Applications",
  description:
    "Lists the platform application objects for the supported push notification services, such as APNS and GCM (Firebase Cloud Messaging).",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description:
            "NextToken string is used when calling ListPlatformApplications action to retrieve additional records that are available after the first page results.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SNSClient({
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

        const command = new ListPlatformApplicationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Platform Applications Result",
      description: "Result from ListPlatformApplications operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PlatformApplications: {
            type: "array",
            items: {
              type: "object",
              properties: {
                PlatformApplicationArn: {
                  type: "string",
                },
                Attributes: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "Platform applications returned when calling ListPlatformApplications action.",
          },
          NextToken: {
            type: "string",
            description:
              "NextToken string is returned when calling ListPlatformApplications action if additional records are available after the first page results.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listPlatformApplications;
