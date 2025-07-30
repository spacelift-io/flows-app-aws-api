import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, DeleteAssociationCommand } from "@aws-sdk/client-ssm";

const deleteAssociation: AppBlock = {
  name: "Delete Association",
  description:
    "Disassociates the specified Amazon Web Services Systems Manager document (SSM document) from the specified managed node.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Name: {
          name: "Name",
          description: "The name of the SSM document.",
          type: "string",
          required: false,
        },
        InstanceId: {
          name: "Instance Id",
          description: "The managed node ID.",
          type: "string",
          required: false,
        },
        AssociationId: {
          name: "Association Id",
          description: "The association ID that you want to delete.",
          type: "string",
          required: false,
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
        });

        const command = new DeleteAssociationCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Delete Association Result",
      description: "Result from DeleteAssociation operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteAssociation;
