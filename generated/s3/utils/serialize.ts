// Utility function to handle AWS SDK response serialization for S3
export async function serializeAWSResponse(response: any): Promise<any> {
  if (!response) return {};

  const { Body, ...safeResponse } = response;
  const result = { ...safeResponse };

  // Handle Body stream if it exists
  if (Body) {
    try {
      // Check if Body is a stream
      if (Body && typeof Body.pipe === "function") {
        const chunks = [];
        for await (const chunk of Body) {
          chunks.push(chunk);
        }
        result.Body = Buffer.concat(chunks).toString("utf-8");
      } else if (Body && typeof Body.transformToString === "function") {
        // Handle AWS SDK v3 streams
        result.Body = await Body.transformToString();
      } else {
        // If Body is already a string or simple value, use it directly
        result.Body = Body;
      }
    } catch (error) {
      // If stream reading fails, provide metadata about the body
      result.Body = "[Stream data - could not serialize]";
      result.BodyMetadata = {
        type: typeof Body,
        isStream: typeof Body.pipe === "function",
        hasTransformToString: typeof Body.transformToString === "function",
      };
    }
  }

  return result;
}
