import { AppBlock, events } from "@slflows/sdk/v1";
import {
  SSMClient,
  AssociateOpsItemRelatedItemCommand,
} from "@aws-sdk/client-ssm";

const associateOpsItemRelatedItem: AppBlock = {
  name: "Associate Ops Item Related Item",
  description:
    "Associates a related item to a Systems Manager OpsCenter OpsItem.",
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
            "The ID of the OpsItem to which you want to associate a resource as a related item.",
          type: "string",
          required: true,
        },
        AssociationType: {
          name: "Association Type",
          description:
            "The type of association that you want to create between an OpsItem and a resource.",
          type: "string",
          required: true,
        },
        ResourceType: {
          name: "Resource Type",
          description:
            "The type of resource that you want to associate with an OpsItem.",
          type: "string",
          required: true,
        },
        ResourceUri: {
          name: "Resource Uri",
          description:
            "The Amazon Resource Name (ARN) of the Amazon Web Services resource that you want to associate with the OpsItem.",
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

        const command = new AssociateOpsItemRelatedItemCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Associate Ops Item Related Item Result",
      description: "Result from AssociateOpsItemRelatedItem operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AssociationId: {
            type: "string",
            description: "The association ID.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default associateOpsItemRelatedItem;
