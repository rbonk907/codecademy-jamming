exports.handler = async function (event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({client_id: process.env.SPOTIFY_CLIENT_ID}),
    };
};