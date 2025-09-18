import { AppBlock, events } from "@slflows/sdk/v1";
import { RedshiftClient, DeletePartnerCommand } from "@aws-sdk/client-redshift";

const deletePartner: AppBlock = {
  name: "Delete Partner",
  description: `Deletes a partner integration from a cluster.`,
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
            "The cluster identifier of the cluster that receives data from the partner.",
          type: "string",
          required: true,
        },
        DatabaseName: {
          name: "Database Name",
          description:
            "The name of the database that receives data from the partner.",
          type: "string",
          required: true,
        },
        PartnerName: {
          name: "Partner Name",
          description:
            "The name of the partner that is authorized to send data.",
          type: "string",
          required: true,
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

        const command = new DeletePartnerCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Partner Result",
      description: "Result from DeletePartner operation",
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

export default deletePartner;
