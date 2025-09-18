import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  DescribePartnersCommand,
} from "@aws-sdk/client-redshift";

const describePartners: AppBlock = {
  name: "Describe Partners",
  description: `Returns information about the partner integrations defined for a cluster.`,
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        AccountId: {
          name: "Account Id",
          description:
            "The Amazon Web Services account ID that owns the cluster.",
          type: "string",
          required: true,
        },
        ClusterIdentifier: {
          name: "Cluster Identifier",
          description:
            "The cluster identifier of the cluster whose partner integration is being described.",
          type: "string",
          required: true,
        },
        DatabaseName: {
          name: "Database Name",
          description:
            "The name of the database whose partner integration is being described.",
          type: "string",
          required: false,
        },
        PartnerName: {
          name: "Partner Name",
          description: "The name of the partner that is being described.",
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

        const command = new DescribePartnersCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Describe Partners Result",
      description: "Result from DescribePartners operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          PartnerIntegrationInfoList: {
            type: "array",
            items: {
              type: "object",
              properties: {
                DatabaseName: {
                  type: "string",
                },
                PartnerName: {
                  type: "string",
                },
                Status: {
                  type: "string",
                },
                StatusMessage: {
                  type: "string",
                },
                CreatedAt: {
                  type: "string",
                },
                UpdatedAt: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "A list of partner integrations.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default describePartners;
