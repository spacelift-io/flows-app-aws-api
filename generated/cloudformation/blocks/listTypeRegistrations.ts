import { AppBlock, events } from "@slflows/sdk/v1";
import {
  CloudFormationClient,
  ListTypeRegistrationsCommand,
} from "@aws-sdk/client-cloudformation";

const listTypeRegistrations: AppBlock = {
  name: "List Type Registrations",
  description:
    "Returns a list of registration tokens for the specified extension(s).",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Type: {
          name: "Type",
          description: "The kind of extension.",
          type: "string",
          required: false,
        },
        TypeName: {
          name: "Type Name",
          description: "The name of the extension.",
          type: "string",
          required: false,
        },
        TypeArn: {
          name: "Type Arn",
          description: "The Amazon Resource Name (ARN) of the extension.",
          type: "string",
          required: false,
        },
        RegistrationStatusFilter: {
          name: "Registration Status Filter",
          description:
            "The current status of the extension registration request.",
          type: "string",
          required: false,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results to be returned with a single call.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "If the previous paginated request didn't return all the remaining results, the response object's NextToken parameter value is set to a token.",
          type: "string",
          required: false,
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
        });

        const command = new ListTypeRegistrationsCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Type Registrations Result",
      description: "Result from ListTypeRegistrations operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          RegistrationTokenList: {
            type: "array",
            items: {
              type: "string",
            },
            description: "A list of extension registration tokens.",
          },
          NextToken: {
            type: "string",
            description:
              "If the request doesn't return all the remaining results, NextToken is set to a token.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listTypeRegistrations;
