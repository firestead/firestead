export default defineEventHandler(async (event) => {
    return {
        statusCode: 200,
        body: {
            message: 'Hello from the serverless function!'
        }
    }
  })