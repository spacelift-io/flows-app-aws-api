import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  GetCheckerIpRangesCommand,
} from "@aws-sdk/client-route-53";

const getCheckerIpRanges: AppBlock = {
  name: "Get Checker Ip Ranges",
  description:
    "Route 53 does not perform authorization for this API because it retrieves information that is already available to the public.",
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

        const client = new Route53Client({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new GetCheckerIpRangesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Checker Ip Ranges Result",
      description: "Result from GetCheckerIpRanges operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          CheckerIpRanges: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A complex type that contains sorted list of IP ranges in CIDR format for Amazon Route 53 health checkers.",
          },
        },
        required: ["CheckerIpRanges"],
      },
    },
  },
};

export default getCheckerIpRanges;
