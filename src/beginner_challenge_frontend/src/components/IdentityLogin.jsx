import { useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import {
  canisterId,
  createActor,
} from "declarations/beginner_challenge_backend";

function IdentityLogin(props) {
  async function handleLogin() {
    const authClient = await AuthClient.create();
    const identity_url =
      process.env.DFX_NETWORK === "local"
        ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`
        : "https://identity.ic0.app";

    await new Promise((resolve) =>
      authClient.login({
        identityProvider: identity_url,
        onSuccess: resolve,
      }),
    );

    const identity = authClient.getIdentity();
    const agent = await HttpAgent.create({ identity });
    if (process.env.DFX_NETWORK === "local") {
      await agent.fetchRootKey();
    }

    const backendActor = createActor(canisterId, { agent });
    props.setBackendActor(backendActor);
  }

  return (
    <button class="button-4" onClick={handleLogin} role="button">
      Login with <strong>Internet Identity</strong>
    </button>
  );
}

export default IdentityLogin;
