import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribeRedshiftIdcApplicationsCommand,
} from "@aws-sdk/client-redshift";

const describeRedshiftIdcApplications: AppBlock = {
  name: "Describe Redshift Idc Applications",
  description: `Lists the Amazon Redshift IAM Identity Center applications.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        RedshiftIdcApplicationArn: {
          name: "Redshift Idc Application Arn",
          description:
            "The ARN for the Redshift application that integrates with IAM Identity Center.",
          type: "string",
          required: false,
        },
        MaxRecords: {
          name: "Max Records",
          description:
            "The maximum number of response records to return in each call.",
          type: "number",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "A value that indicates the starting point for the next set of response records in a subsequent request.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new RedshiftClient({
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

        const command = new DescribeRedshiftIdcApplicationsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Redshift Idc Applications Result",
      description: "Result from DescribeRedshiftIdcApplications operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RedshiftIdcApplications: {
            type: "array",
            items: {
              type: "object",
              properties: {
                IdcInstanceArn: {
                  type: "string",
                },
                RedshiftIdcApplicationName: {
                  type: "string",
                },
                RedshiftIdcApplicationArn: {
                  type: "string",
                },
                IdentityNamespace: {
                  type: "string",
                },
                IdcDisplayName: {
                  type: "string",
                },
                IamRoleArn: {
                  type: "string",
                },
                IdcManagedApplicationArn: {
                  type: "string",
                },
                IdcOnboardStatus: {
                  type: "string",
                },
                AuthorizedTokenIssuerList: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      TrustedTokenIssuerArn: {
                        type: "object",
                        additionalProperties: true,
                      },
                      AuthorizedAudiencesList: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    additionalProperties: false,
                  },
                },
                ServiceIntegrations: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              additionalProperties: false,
            },
            description:
              "The list of Amazon Redshift IAM Identity Center applications.",
          },
          Marker: {
            type: "string",
            description:
              "A value that indicates the starting point for the next set of response records in a subsequent request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describeRedshiftIdcApplications;
