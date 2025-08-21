import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyVpcEndpointServicePermissionsCommand,
} from "@aws-sdk/client-ec2";

const modifyVpcEndpointServicePermissions: AppBlock = {
  name: "Modify Vpc Endpoint Service Permissions",
  description: "Modifies the permissions for your VPC endpoint service.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
          required: false,
        },
        ServiceId: {
          name: "Service Id",
          description: "The ID of the service.",
          type: "string",
          required: true,
        },
        AddAllowedPrincipals: {
          name: "Add Allowed Principals",
          description: "The Amazon Resource Names (ARN) of the principals.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
        RemoveAllowedPrincipals: {
          name: "Remove Allowed Principals",
          description: "The Amazon Resource Names (ARN) of the principals.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new EC2Client({
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

        const command = new ModifyVpcEndpointServicePermissionsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Vpc Endpoint Service Permissions Result",
      description: "Result from ModifyVpcEndpointServicePermissions operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          AddedPrincipals: {
            type: "array",
            items: {
              type: "object",
              properties: {
                PrincipalType: {
                  type: "string",
                },
                Principal: {
                  type: "string",
                },
                ServicePermissionId: {
                  type: "string",
                },
                ServiceId: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "Information about the added principals.",
          },
          ReturnValue: {
            type: "boolean",
            description:
              "Returns true if the request succeeds; otherwise, it returns an error.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyVpcEndpointServicePermissions;
