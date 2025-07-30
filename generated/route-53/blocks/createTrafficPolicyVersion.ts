import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  CreateTrafficPolicyVersionCommand,
} from "@aws-sdk/client-route-53";

const createTrafficPolicyVersion: AppBlock = {
  name: "Create Traffic Policy Version",
  description: "Creates a new version of an existing traffic policy.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Id: {
          name: "Id",
          description:
            "The ID of the traffic policy for which you want to create a new version.",
          type: "string",
          required: true,
        },
        Document: {
          name: "Document",
          description:
            "The definition of this version of the traffic policy, in JSON format.",
          type: "string",
          required: true,
        },
        Comment: {
          name: "Comment",
          description:
            "The comment that you specified in the CreateTrafficPolicyVersion request, if any.",
          type: "string",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new Route53Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new CreateTrafficPolicyVersionCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Traffic Policy Version Result",
      description: "Result from CreateTrafficPolicyVersion operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          TrafficPolicy: {
            type: "object",
            properties: {
              Id: {
                type: "string",
              },
              Version: {
                type: "number",
              },
              Name: {
                type: "string",
              },
              Type: {
                type: "string",
              },
              Document: {
                type: "string",
              },
              Comment: {
                type: "string",
              },
            },
            required: ["Id", "Version", "Name", "Type", "Document"],
            additionalProperties: false,
            description:
              "A complex type that contains settings for the new version of the traffic policy.",
          },
          Location: {
            type: "string",
            description:
              "A unique URL that represents a new traffic policy version.",
          },
        },
        required: ["TrafficPolicy", "Location"],
      },
    },
  },
};

export default createTrafficPolicyVersion;
