import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFrontClient,
  GetManagedCertificateDetailsCommand,
} from "@aws-sdk/client-cloudfront";

const getManagedCertificateDetails: AppBlock = {
  name: "Get Managed Certificate Details",
  description: "Gets details about the CloudFront managed ACM certificate.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Identifier: {
          name: "Identifier",
          description: "The identifier of the distribution tenant.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFrontClient({
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

        const command = new GetManagedCertificateDetailsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Managed Certificate Details Result",
      description: "Result from GetManagedCertificateDetails operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          ManagedCertificateDetails: {
            type: "object",
            properties: {
              CertificateArn: {
                type: "string",
              },
              CertificateStatus: {
                type: "string",
              },
              ValidationTokenHost: {
                type: "string",
              },
              ValidationTokenDetails: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Domain: {
                      type: "string",
                    },
                    RedirectTo: {
                      type: "string",
                    },
                    RedirectFrom: {
                      type: "string",
                    },
                  },
                  required: ["Domain"],
                  additionalProperties: false,
                },
              },
            },
            additionalProperties: false,
            description:
              "Contains details about the CloudFront managed ACM certificate.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getManagedCertificateDetails;
