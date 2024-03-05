import { KJUR } from 'jsrsasign';
function generateSDKSignature(data: {
  // sdkKey: string;
  // sdkSecret: string;
  clientId: string;
  clientSecret: string;
  meetingNumber: string;
  role: string;
}) {
  let signature = '';
  const { meetingNumber, role } = data;
  // try {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  // Header
  const oHeader = { alg: 'HS256', typ: 'JWT' };
  // Payload
  const oPayload = {
    sdkKey: data?.clientId,
    appKey: data?.clientId,
    iat,
    exp,
    mn: meetingNumber,
    role,
  };
  // Sign JWT
  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, data.clientSecret);

  return signature;
}
export { generateSDKSignature };
