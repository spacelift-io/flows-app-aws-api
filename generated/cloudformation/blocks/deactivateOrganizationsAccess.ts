import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  DeactivateOrganizationsAccessCommand,
} from "@aws-sdk/client-cloudformation";

const deactivateOrganizationsAccess: AppBlock = {
  name: "Deactivate Organizations Access",
  description: "Deactivates trusted access with Organizations.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudFormationClient({
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

        const command = new DeactivateOrganizationsAccessCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Deactivate Organizations Access Result",
      description: "Result from DeactivateOrganizationsAccess operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deactivateOrganizationsAccess;
