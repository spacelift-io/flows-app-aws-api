import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudControlClient,
  GetResourceCommand,
} from "@aws-sdk/client-cloudcontrol";

const getResource: AppBlock = {
  name: "Get Resource",
  description:
    "Returns information about the current state of the specified resource.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        TypeName: {
          name: "Type Name",
          description: "The name of the resource type.",
          type: "string",
          required: true,
        },
        TypeVersionId: {
          name: "Type Version Id",
          description:
            "For private resource types, the type version to use in this resource operation.",
          type: "string",
          required: false,
        },
        RoleArn: {
          name: "Role Arn",
          description:
            "The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role for Cloud Control API to use when performing this resource operation.",
          type: "string",
          required: false,
        },
        Identifier: {
          name: "Identifier",
          description: "The identifier for the resource.",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new CloudControlClient({
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

        const command = new GetResourceCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Resource Result",
      description: "Result from GetResource operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TypeName: {
            type: "string",
            description: "The name of the resource type.",
          },
          ResourceDescription: {
            type: "object",
            properties: {
              Identifier: {
                type: "string",
              },
              Properties: {
                type: "string",
              },
            },
            additionalProperties: false,
            description: "Represents information about a provisioned resource.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getResource;
