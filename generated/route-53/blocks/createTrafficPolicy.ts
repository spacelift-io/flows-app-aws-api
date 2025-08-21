import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  CreateTrafficPolicyCommand,
} from "@aws-sdk/client-route-53";

const createTrafficPolicy: AppBlock = {
  name: "Create Traffic Policy",
  description:
    "Creates a traffic policy, which you use to create multiple DNS resource record sets for one domain name (such as example.",
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
          description: "The name of the traffic policy.",
          type: "string",
          required: true,
        },
        Document: {
          name: "Document",
          description: "The definition of this traffic policy in JSON format.",
          type: "string",
          required: true,
        },
        Comment: {
          name: "Comment",
          description:
            "(Optional) Any comments that you want to include about the traffic policy.",
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
          ...(input.app.config.endpoint && {
            endpoint: input.app.config.endpoint,
          }),
        });

        const command = new CreateTrafficPolicyCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Traffic Policy Result",
      description: "Result from CreateTrafficPolicy operation",
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
              "A complex type that contains settings for the new traffic policy.",
          },
          Location: {
            type: "string",
            description: "A unique URL that represents a new traffic policy.",
          },
        },
        required: ["TrafficPolicy", "Location"],
      },
    },
  },
};

export default createTrafficPolicy;
