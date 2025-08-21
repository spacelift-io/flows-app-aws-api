import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  DisassociateOpsItemRelatedItemCommand,
} from "@aws-sdk/client-ssm";

const disassociateOpsItemRelatedItem: AppBlock = {
  name: "Disassociate Ops Item Related Item",
  description: "Deletes the association between an OpsItem and a related item.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        OpsItemId: {
          name: "Ops Item Id",
          description:
            "The ID of the OpsItem for which you want to delete an association between the OpsItem and a related item.",
          type: "string",
          required: true,
        },
        AssociationId: {
          name: "Association Id",
          description:
            "The ID of the association for which you want to delete an association between the OpsItem and a related item.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SSMClient({
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

        const command = new DisassociateOpsItemRelatedItemCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Disassociate Ops Item Related Item Result",
      description: "Result from DisassociateOpsItemRelatedItem operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default disassociateOpsItemRelatedItem;
