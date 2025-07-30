import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, GetResourcePoliciesCommand } from "@aws-sdk/client-ssm";

const getResourcePolicies: AppBlock = {
  name: "Get Resource Policies",
  description: "Returns an array of the Policy object.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        ResourceArn: {
          name: "Resource Arn",
          description:
            "Amazon Resource Name (ARN) of the resource to which the policies are attached.",
          type: "string",
          required: true,
        },
        NextToken: {
          name: "Next Token",
          description: "A token to start the list.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description: "The maximum number of items to return for this call.",
          type: "number",
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

        const command = new GetResourcePoliciesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Resource Policies Result",
      description: "Result from GetResourcePolicies operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          NextToken: {
            type: "string",
            description: "The token for the next set of items to return.",
          },
          Policies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                PolicyId: {
                  type: "string",
                },
                PolicyHash: {
                  type: "string",
                },
                Policy: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description: "An array of the Policy object.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getResourcePolicies;
