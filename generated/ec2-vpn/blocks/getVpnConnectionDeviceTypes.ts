import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  GetVpnConnectionDeviceTypesCommand,
} from "@aws-sdk/client-ec2";

const getVpnConnectionDeviceTypes: AppBlock = {
  name: "Get Vpn Connection Device Types",
  description:
    "Obtain a list of customer gateway devices for which sample configuration files can be provided.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        MaxResults: {
          name: "Max Results",
          description:
            "The maximum number of results returned by GetVpnConnectionDeviceTypes in paginated output.",
          type: "number",
          required: false,
        },
        NextToken: {
          name: "Next Token",
          description:
            "The NextToken value returned from a previous paginated GetVpnConnectionDeviceTypes request where MaxResults was used and the results exceeded the value of that parameter.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the action, without actually making the request, and provides an error response.",
          type: "boolean",
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
        });

        const command = new GetVpnConnectionDeviceTypesCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Vpn Connection Device Types Result",
      description: "Result from GetVpnConnectionDeviceTypes operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          VpnConnectionDeviceTypes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                VpnConnectionDeviceTypeId: {
                  type: "string",
                },
                Vendor: {
                  type: "string",
                },
                Platform: {
                  type: "string",
                },
                Software: {
                  type: "string",
                },
              },
              additionalProperties: false,
            },
            description:
              "List of customer gateway devices that have a sample configuration file available for use.",
          },
          NextToken: {
            type: "string",
            description:
              "The NextToken value to include in a future GetVpnConnectionDeviceTypes request.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default getVpnConnectionDeviceTypes;
