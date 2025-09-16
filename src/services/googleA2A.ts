// import { google } from 'googleapis'

// This would be on your backend
export const getGoogleAccessToken = async () => {
  // const auth = new google.auth.GoogleAuth({
  //   // Your credentials here
  //   // keyFile: 'path/to/your/keyfile.json',
  //   scopes: ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
  // })

  // const accessToken = await auth.getAccessToken()
  // return accessToken
  return 'mock-token'
}

export const sendToGoogleA2A = async (text: string, conversationId: string) => {
  const accessToken = await getGoogleAccessToken()
  const url = `https://actions.googleapis.com/v2/conversations/${conversationId}:send`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      queryInput: {
        text: {
          text: text,
          languageCode: 'en-US',
        },
      },
      conversationId: conversationId
    }),
  })

  return await response.json()
}