import { AppBlock, events } from "@slflows/sdk/v1";
import { SESClient, ListReceiptFiltersCommand } from "@aws-sdk/client-ses";

const listReceiptFilters: AppBlock = {
  name: "List Receipt Filters",
  description:
    "Lists the IP address filters associated with your Amazon Web Services account in the current Amazon Web Services Region.",
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

        const client = new SESClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListReceiptFiltersCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List Receipt Filters Result",
      description: "Result from ListReceiptFilters operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Filters: {
            type: "array",
            items: {
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
            description:
              "A list of IP address filter data structures, which each consist of a name, an IP address range, and whether to allow or block mail from it.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default listReceiptFilters;
