import { AppBlock, events } from "@slflows/sdk/v1";
import {
  IAMClient,
  GenerateServiceLastAccessedDetailsCommand,
} from "@aws-sdk/client-iam";

const generateServiceLastAccessedDetails: AppBlock = {
  name: "Generate Service Last Accessed Details",
  description:
    "Generates a report that includes details about when an IAM resource (user, group, role, or policy) was last used in an attempt to access Amazon Web Services services.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Arn: {
          name: "Arn",
          description:
            "The ARN of the IAM resource (user, group, role, or managed policy) used to generate information about when the resource was last used in an attempt to access an Amazon Web Services service.",
          type: "string",
          required: true,
        },
        Granularity: {
          name: "Granularity",
          description: "The level of detail that you want to generate.",
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
        });

        const command = new GenerateServiceLastAccessedDetailsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Generate Service Last Accessed Details Result",
      description: "Result from GenerateServiceLastAccessedDetails operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          JobId: {
            type: "string",
            description:
              "The JobId that you can use in the GetServiceLastAccessedDetails or GetServiceLastAccessedDetailsWithEntities operations.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default generateServiceLastAccessedDetails;
