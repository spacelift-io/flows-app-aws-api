import { AppBlock, events } from "@slflows/sdk/v1";
import { IAMClient, ListMFADevicesCommand } from "@aws-sdk/client-iam";

const listMFADevices: AppBlock = {
  name: "List MFA Devices",
  description: "Lists the MFA devices for an IAM user.",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "AWS region for this operation",
          type: "string",
          required: true,
        },
        UserName: {
          name: "User Name",
          description:
            "The name of the user whose MFA devices you want to list.",
          type: "string",
          required: false,
        },
        Marker: {
          name: "Marker",
          description:
            "Use this parameter only when paginating results and only after you receive a response indicating that the results are truncated.",
          type: "string",
          required: false,
        },
        MaxItems: {
          name: "Max Items",
          description:
            "Use this only when paginating results to indicate the maximum number of items you want in the response.",
          type: "number",
          required: false,
        },
      },
      onEvent: async (input) => {
        const { region, ...commandInput } = input.event.inputConfig;

        const client = new IAMClient({
          region: region,
          credentials: {
            accessKeyId: input.app.config.accessKeyId,
            secretAccessKey: input.app.config.secretAccessKey,
            sessionToken: input.app.config.sessionToken,
          },
        });

        const command = new ListMFADevicesCommand(commandInput as any);
        const response = await client.send(command);

        await events.emit(response || {});
      },
    },
  },
  outputs: {
    default: {
      name: "List MFA Devices Result",
      description: "Result from ListMFADevices operation",
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          MFADevices: {
            type: "array",
            items: {
              type: "object",
              properties: {
                UserName: {
                  type: "string",
                },
                SerialNumber: {
                  type: "string",
                },
                EnableDate: {
                  type: "string",
                },
              },
              required: ["UserName", "SerialNumber", "EnableDate"],
              additionalProperties: false,
            },
            description: "A list of MFA devices.",
          },
          IsTruncated: {
            type: "boolean",
            description:
              "A flag that indicates whether there are more items to return.",
          },
          Marker: {
            type: "string",
            description:
              "When IsTruncated is true, this element is present and contains the value to use for the Marker parameter in a subsequent pagination request.",
          },
        },
        required: ["MFADevices"],
      },
    },
  },
};

export default listMFADevices;
