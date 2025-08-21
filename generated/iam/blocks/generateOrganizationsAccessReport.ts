import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  GenerateOrganizationsAccessReportCommand,
} from "@aws-sdk/client-iam";

const generateOrganizationsAccessReport: AppBlock = {
  name: "Generate Organizations Access Report",
  description:
    "Generates a report for service last accessed data for Organizations.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        EntityPath: {
          name: "Entity Path",
          description:
            "The path of the Organizations entity (root, OU, or account).",
          type: "string",
          required: true,
        },
        OrganizationsPolicyId: {
          name: "Organizations Policy Id",
          description:
            "The identifier of the Organizations service control policy (SCP).",
          type: "string",
          required: false,
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

        const command = new GenerateOrganizationsAccessReportCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Generate Organizations Access Report Result",
      description: "Result from GenerateOrganizationsAccessReport operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          JobId: {
            type: "string",
            description:
              "The job identifier that you can use in the GetOrganizationsAccessReport operation.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default generateOrganizationsAccessReport;
