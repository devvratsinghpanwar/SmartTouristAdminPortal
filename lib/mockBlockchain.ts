import { createHash } from "crypto";

// This class simulates the core functions of a blockchain smart contract for this project.

// It ensures data integrity and uniqueness without the complexity of a real blockchain setup.
interface DigitalId {
  id: string;
  kycHash: string;
  itinerary: string[];
  emergencyContacts: string[];
  validUntil: Date;
  issuedAt: Date;
}

class MockBlockchain {
  private ledger: Map<string, DigitalId> = new Map();

  // Simulates "minting" a new NFT or token on the blockchain.
  // Returns a unique ID for the tourist.

  public createDigitalId(
    kcyData: Record<string, any>,
    itinerary: string[],
    emergencyContacts: string[],
    durationInDays: number
  ): DigitalId {
    // 1. create a hash of the KYC data to represent the unique identity without storing personal data.
    const kycString = JSON.stringify(kcyData);
    const kycHash = createHash("sha256").update(kycString).digest("hex");

    // 2. Generate a unique ID (in a real backchain, this would be the transaction hash or token ID)
    const uniqueId = `TID- ${createHash("sha256")
      .update(kycHash + Date.now())
      .digest("hex")
      .substring(0, 12)}`;

    //3. validity period

    const issuedAt = new Date();
    const validUntil = new Date();
    validUntil.setDate(issuedAt.getDate() + durationInDays);

    const newId: DigitalId = {
      id: uniqueId,
      kycHash,
      itinerary,
      emergencyContacts,
      validUntil,
      issuedAt,
    };
    //4. commit to the ledger. This is tamper-proof in our simulation
    this.ledger.set(uniqueId, newId);
    console.log(`[MockBlockchain] Minted New digital ID: ${uniqueId}`);
    return newId;
  }

  // simulate reading data from the blockchain
  public getDigitalId(id: string): DigitalId | undefined{
    return this.ledger.get(id);
  }
}

// export a single instance to act as our singleton blockchain

const mockBlockchain = new MockBlockchain();
export default mockBlockchain;


