import { AppBlock, events } from "@slflows/sdk/v1";
import { SSMClient, PutParameterCommand } from "@aws-sdk/client-ssm";

const putParameter: AppBlock = {
  name: "Put Parameter",
  description: "Create or update a parameter in Parameter Store.",
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
          description:
            "The fully qualified name of the parameter that you want to create or update.",
          type: "string",
          required: true,
        },
        Description: {
          name: "Description",
          description:
            "Information about the parameter that you want to add to the system.",
          type: "string",
          required: false,
        },
        Value: {
          name: "Value",
          description:
            "The parameter value that you want to add to the system.",
          type: "string",
          required: true,
        },
        Type: {
          name: "Type",
          description: "The type of parameter that you want to create.",
          type: "string",
          required: false,
        },
        KeyId: {
          name: "Key Id",
          description:
            "The Key Management Service (KMS) ID that you want to use to encrypt a parameter.",
          type: "string",
          required: false,
        },
        Overwrite: {
          name: "Overwrite",
          description: "Overwrite an existing parameter.",
          type: "boolean",
          required: false,
        },
        AllowedPattern: {
          name: "Allowed Pattern",
          description:
            "A regular expression used to validate the parameter value.",
          type: "string",
          required: false,
        },
        Tags: {
          name: "Tags",
          description: "Optional metadata that you assign to a resource.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Key: {
                  type: "string",
                },
                Value: {
                  type: "string",
                },
              },
              required: ["Key", "Value"],
              additionalProperties: false,
            },
          },
          required: false,
        },
        Tier: {
          name: "Tier",
          description: "The parameter tier to assign to a parameter.",
          type: "string",
          required: false,
        },
        Policies: {
          name: "Policies",
          description: "One or more policies to apply to a parameter.",
          type: "string",
          required: false,
        },
        DataType: {
          name: "Data Type",
          description: "The data type for a String parameter.",
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

        const command = new PutParameterCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Put Parameter Result",
      description: "Result from PutParameter operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Version: {
            type: "number",
            description: "The new version number of a parameter.",
          },
          Tier: {
            type: "string",
            description: "The tier assigned to the parameter.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default putParameter;
