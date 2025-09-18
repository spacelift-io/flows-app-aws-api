import { AppBlock, events } from "@slflows/sdk/v1";
import { RedshiftClient, AddPartnerCommand } from "@aws-sdk/client-redshift";

const addPartner: AppBlock = {
  name: "Add Partner",
  description: `Adds a partner integration to a cluster.`,
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

        const command = new AddPartnerCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Add Partner Result",
      description: "Result from AddPartner operation",
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

export default addPartner;
