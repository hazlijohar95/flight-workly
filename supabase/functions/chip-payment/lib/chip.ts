
import * as crypto from "https://deno.land/std@0.177.0/crypto/mod.ts";

const CHIP_API_KEY = Deno.env.get('CHIP_API_KEY');
const CHIP_API_SECRET = Deno.env.get('CHIP_API_SECRET');
export const CHIP_API_URL = 'https://gate.chip-in.asia/api/v1';
export const CHIP_SEND_API_URL = 'https://staging-api.chip-in.asia/api/'; // Using staging URL for development

export async function generateChecksum(epoch: number): Promise<string> {
  if (!CHIP_API_KEY || !CHIP_API_SECRET) {
    throw new Error('Missing CHIP API credentials');
  }
  
  const data = `${epoch}${CHIP_API_KEY}`;
  
  // Convert string to Uint8Array
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const secretBuffer = encoder.encode(CHIP_API_SECRET);
  
  // Create HMAC using SHA-512
  const key = await crypto.subtle.importKey(
    "raw",
    secretBuffer,
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", key, dataBuffer);
  
  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getChipApiKey() {
  return CHIP_API_KEY;
}
