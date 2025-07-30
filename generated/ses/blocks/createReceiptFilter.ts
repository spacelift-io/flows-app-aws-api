import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, CreateReceiptFilterCommand } from "@aws-sdk/client-ses";

const createReceiptFilter: AppBlock = {
  name: "Create Receipt Filter",
  description: "Creates a new IP address filter.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        Filter: {
          name: "Filter",
          description:
            "A data structure that describes the IP address filter to create, which consists of a name, an IP address range, and whether to allow or block mail from it.",
          type: {
            type: "object",
            properties: {
              Name: {
                type: "string",
              },
              IpFilter: {
                type: "object",
                properties: {
                  Policy: {
                    type: "string",
                  },
                  Cidr: {
                    type: "string",
                  },
                },
                required: ["Policy", "Cidr"],
                additionalProperties: false,
              },
            },
            required: ["Name", "IpFilter"],
            additionalProperties: false,
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new SESClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new CreateReceiptFilterCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Create Receipt Filter Result",
      description: "Result from CreateReceiptFilter operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default createReceiptFilter;
