import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudControlClient,
  ListResourcesCommand,
} from "@aws-sdk/client-cloudcontrol";

const listResources: AppBlock = {
  name: "List Resources",
  description: "Returns information about the specified resources.",
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
        NextToken: {
          name: "Next Token",
          description:
            "If the previous paginated request didn't return all of the remaining results, the response object's NextToken parameter value is set to a token.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "Reserved.",
          type: "number",
          required: false,
        },
        ResourceModel: {
          name: "Resource Model",
          description:
            "The resource model to use to select the resources to return.",
          type: "string",
          required: false,
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

        const command = new ListResourcesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Resources Result",
      description: "Result from ListResources operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TypeName: {
            type: "string",
            description: "The name of the resource type.",
          },
          ResourceDescriptions: {
            type: "array",
            items: {
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
            },
            description:
              "Information about the specified resources, including primary identifier and resource model.",
          },
          NextToken: {
            type: "string",
            description:
              "If the request doesn't return all of the remaining results, NextToken is set to a token.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listResources;
