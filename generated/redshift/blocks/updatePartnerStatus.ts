import { AppBlock, events } from "@slflows/sdk/v1";
import {
  RedshiftClient,
  UpdatePartnerStatusCommand,
} from "@aws-sdk/client-redshift";

const updatePartnerStatus: AppBlock = {
  name: "Update Partner Status",
  description: `Updates the status of a partner integration.`,
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
            "The cluster identifier of the cluster whose partner integration status is being updated.",
          type: "string",
          required: true,
        },
        DatabaseName: {
          name: "Database Name",
          description:
            "The name of the database whose partner integration status is being updated.",
          type: "string",
          required: true,
        },
        PartnerName: {
          name: "Partner Name",
          description:
            "The name of the partner whose integration status is being updated.",
          type: "string",
          required: true,
        },
        Status: {
          name: "Status",
          description: "The value of the updated status.",
          type: "string",
          required: true,
        },
        StatusMessage: {
          name: "Status Message",
          description: "The status message provided by the partner.",
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

        const command = new UpdatePartnerStatusCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Update Partner Status Result",
      description: "Result from UpdatePartnerStatus operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          DatabaseName: {
            type: "string",
            description:
              "The name of the database that receives data from the partner.",
          },
          PartnerName: {
            type: "string",
            description:
              "The name of the partner that is authorized to send data.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default updatePartnerStatus;
