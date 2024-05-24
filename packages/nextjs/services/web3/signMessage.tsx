import lighthouse from "@lighthouse-web3/sdk";
import { getAccount, signMessage } from "@wagmi/core";
import axios from "axios";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

export const getApiKey = async () => {
  const account = await getAccount(wagmiConfig);

  const verificationMessage = (
    await axios.get(`https://api.lighthouse.storage/api/auth/get_message?publicKey=${account.address}`)
  ).data;

  console.log("verificationMessage", verificationMessage);

  const signedmessage = await signMessage(wagmiConfig, { message: verificationMessage });

  const response = await lighthouse.getApiKey(account.address as string, signedmessage);
  console.log("response", response.data.apiKey);

  return response.data.apiKey;
};

export const createNewPost = async body => {
  const apiKey = await getApiKey();
  const name = "fil"; //Optional

  const response = await lighthouse.uploadText(body, apiKey, name);

  console.log(response);
  return response;
};
