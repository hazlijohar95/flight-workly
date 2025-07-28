
import { getChipApiKey, CHIP_SEND_API_URL } from "../lib/chip.ts";

// Check available balance in CHIP account
export async function checkAvailableBalance(
  epoch: number,
  checksum: string
): Promise<Record<string, unknown>> {
  const response = await fetch(`${CHIP_SEND_API_URL}accounts`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${getChipApiKey()}`,
      'epoch': epoch.toString(),
      'checksum': checksum
    }
  });
  
  const data = await response.json();
  console.log('Accounts API response:', data);
  return data;
}

// Add bank account to CHIP
export async function addBankAccount(
  epoch: number,
  checksum: string,
  freelancerData: Record<string, unknown>,
  jobId: string
): Promise<Record<string, unknown>> {
  const response = await fetch(`${CHIP_SEND_API_URL}bank_accounts`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getChipApiKey()}`,
      'epoch': epoch.toString(),
      'checksum': checksum
    },
    body: JSON.stringify({
      bank_account: {
        account_name: `${freelancerData.first_name} ${freelancerData.last_name}`,
        account_number: "1234567890", // In production, fetch from secured storage
        bank_code: "MBBEMYKL",  // Maybank
        reference: `Payment for job ${jobId}`
      }
    })
  });
  
  const data = await response.json();
  console.log('Bank account API response:', data);
  
  if (!data.id) {
    throw new Error('Failed to add bank account: ' + JSON.stringify(data));
  }
  
  return data;
}

// Create send instruction in CHIP
export async function createSendInstruction(
  epoch: number,
  checksum: string,
  transactionData: Record<string, unknown>,
  bankAccountId: string,
  jobId: string
): Promise<Record<string, unknown>> {
  const response = await fetch(`${CHIP_SEND_API_URL}send_instructions`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getChipApiKey()}`,
      'epoch': epoch.toString(),
      'checksum': checksum
    },
    body: JSON.stringify({
      send_instruction: {
        amount: transactionData.amount,
        bank_account_id: bankAccountId,
        remarks: `Payment for job: ${jobId}`,
        reference: `job-payment-${jobId}`,
        currency: transactionData.currency || "MYR"
      }
    })
  });
  
  const data = await response.json();
  console.log('Send instruction API response:', data);
  
  if (!data.id) {
    throw new Error('Failed to create send instruction: ' + JSON.stringify(data));
  }
  
  return data;
}
