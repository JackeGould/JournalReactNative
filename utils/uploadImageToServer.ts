import Constants from "expo-constants";

const IP_ADDRESS = Constants.expoConfig?.extra?.IP_ADDRESS;

// Uploads a local image file to the server and returns the image URL
export const uploadImageToServer = async (uri: string): Promise<string> => {
  try {
    // Step 1: Fetch the local file and convert it to a Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Step 2: Prepare form data for file upload
    const formData = new FormData();
    formData.append("profileImage", blob, "profile.jpg"); // Name used by backend parser

    // Step 3: POST the image to your server's upload endpoint
    const res = await fetch(`http://${IP_ADDRESS}:4000/uploads`, {
      method: "POST",
      body: formData,
      // Do NOT set 'Content-Type' — fetch automatically sets the correct multipart boundary
    });

    // Step 4: Inspect and validate the response
    const contentType = res.headers.get("Content-Type");
    console.log("Response content-type:", contentType);
    console.log("Status:", res.status);

    if (contentType && contentType.includes("application/json")) {
      const json = await res.json();

      if (json.error) {
        throw new Error(json.error); // Server responded with an error
      }

      return json.imageUrl; // Success — return uploaded image URL
    } else {
      const text = await res.text();
      throw new Error(`Unexpected response: ${text}`);
    }
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
