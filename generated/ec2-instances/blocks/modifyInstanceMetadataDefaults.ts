import { AppBlock, events } from "@slflows/sdk/v1";
import {
  EC2Client,
  ModifyInstanceMetadataDefaultsCommand,
} from "@aws-sdk/client-ec2";

const modifyInstanceMetadataDefaults: AppBlock = {
  name: "Modify Instance Metadata Defaults",
  description:
    "Modifies the default instance metadata service (IMDS) settings at the account level in the specified Amazon Web Services Region.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        HttpTokens: {
          name: "Http Tokens",
          description: "Indicates whether IMDSv2 is required.",
          type: "string",
          required: false,
        },
        HttpPutResponseHopLimit: {
          name: "Http Put Response Hop Limit",
          description:
            "The maximum number of hops that the metadata token can travel.",
          type: "number",
          required: false,
        },
        HttpEndpoint: {
          name: "Http Endpoint",
          description: "Enables or disables the IMDS endpoint on an instance.",
          type: "string",
          required: false,
        },
        InstanceMetadataTags: {
          name: "Instance Metadata Tags",
          description:
            "Enables or disables access to an instance's tags from the instance metadata.",
          type: "string",
          required: false,
        },
        DryRun: {
          name: "Dry Run",
          description:
            "Checks whether you have the required permissions for the operation, without actually making the request, and provides an error response.",
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

        const command = new ModifyInstanceMetadataDefaultsCommand(
          commandInput as any,
        );
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "Modify Instance Metadata Defaults Result",
      description: "Result from ModifyInstanceMetadataDefaults operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          Return: {
            type: "boolean",
            description: "If the request succeeds, the response returns true.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default modifyInstanceMetadataDefaults;
