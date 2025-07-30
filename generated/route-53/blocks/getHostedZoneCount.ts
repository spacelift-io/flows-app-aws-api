import { AppBlock, events } from "@slflows/sdk/v1";
import {
  Route53Client,
  GetHostedZoneCountCommand,
} from "@aws-sdk/client-route-53";

const getHostedZoneCount: AppBlock = {
  name: "Get Hosted Zone Count",
  description:
    "Retrieves the number of hosted zones that are associated with the current Amazon Web Services account.",
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

        const command = new GetHostedZoneCountCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Get Hosted Zone Count Result",
      description: "Result from GetHostedZoneCount operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          HostedZoneCount: {
            type: "number",
            description:
              "The total number of public and private hosted zones that are associated with the current Amazon Web Services account.",
          },
        },
        required: ["HostedZoneCount"],
      },
    },
  },
};

export default getHostedZoneCount;
