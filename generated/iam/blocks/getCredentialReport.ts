import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, GetCredentialReportCommand } from "@aws-sdk/client-iam";

const getCredentialReport: AppBlock = {
  name: "Get Credential Report",
  description:
    "Retrieves a credential report for the Amazon Web Services account.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetCredentialReportCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Credential Report Result",
      description: "Result from GetCredentialReport operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Content: {
            type: "string",
            description: "Contains the credential report.",
          },
          ReportFormat: {
            type: "string",
            description: "The format (MIME type) of the credential report.",
          },
          GeneratedTime: {
            type: "string",
            description:
              "The date and time when the credential report was created, in ISO 8601 date-time format.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getCredentialReport;
