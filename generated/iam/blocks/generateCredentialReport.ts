import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  GenerateCredentialReportCommand,
} from "@aws-sdk/client-iam";

const generateCredentialReport: AppBlock = {
  name: "Generate Credential Report",
  description:
    "Generates a credential report for the Amazon Web Services account.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new GenerateCredentialReportCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Generate Credential Report Result",
      description: "Result from GenerateCredentialReport operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          State: {
            type: "string",
            description:
              "Information about the state of the credential report.",
          },
          Description: {
            type: "string",
            description: "Information about the credential report.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default generateCredentialReport;
