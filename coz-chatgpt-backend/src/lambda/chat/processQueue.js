var AWS = require("aws-sdk");
const { Configuration, OpenAIApi } = require("openai");

var moment = require('moment');
async function sendMessage(userResult, item) {



    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: 'chatgptapp-chat-messages',
        Item: item
    };
    await docClient.put(params).promise();

    if (userResult.Items) {
        const apigwManagementApi = new AWS.ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: `${process.env.socket_api_gateway_id}.execute-api.ap-northeast-2.amazonaws.com/dev`
        });

        const postCalls = userResult.Items.map(async ({ connection_id }) => {
            const dt = { ConnectionId: connection_id, Data: JSON.stringify(item) };
            try {
                await apigwManagementApi.postToConnection(dt).promise();
            } catch (e) {
                console.log(e);
                //만약 이 접속은 끊긴 접속이라면, DB에서 삭제한다.
                if (e.statusCode === 410) {
                    console.log(`Found stale connection, deleting ${connection_id}`);
                    var params = {
                        TableName: 'chatgptapp-userlist',
                        Key: {
                            connection_id: connection_id
                        }
                    };
                    await docClient.delete(params).promise();
                }
            }
        });
        try {
            await Promise.all(postCalls);
        } catch (e) {
            return { statusCode: 500, body: e.stack };
        }
    }
}

exports.handler = async function (event, context) {

    console.log(event);

    var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    const now = moment();
    var docClient = new AWS.DynamoDB.DocumentClient();
    await event.Records.reduce(async (previousPromise2, qMessage) => {
        await previousPromise2;
        return new Promise(async (resolve2, reject2) => {
            var accountId = context.invokedFunctionArn.split(":")[4];
            var qName = qMessage.eventSourceARN.split(":")[5];
            var queueUrl = `https://sqs.${process.env.region}.amazonaws.com/${accountId}/${qName}`;
            console.log("queueUrl:", queueUrl);
            console.log("qMessage:", qMessage)
            const item = JSON.parse(qMessage.body);

            var params = {
                TableName: 'chatgptapp-userlist',
                IndexName: 'room_id-user_id-index',
                KeyConditionExpression: '#HashKey = :hkey',
                ExpressionAttributeNames: { '#HashKey': 'room_id' },
                ExpressionAttributeValues: {
                    ':hkey': item.room_id
                }
            };

            const result = await docClient.query(params).promise();

            try {
                const item = JSON.parse(qMessage.body);
                const configuration = new Configuration({
                    apiKey: process.env.OPENAPI_APIKEY,
                });
                //console.log(process.env.OPENAPI_APIKEY);

                const prompt = item.message
                const openai = new OpenAIApi(configuration);
                const defaultModelParams = {
                    frequency_penalty: 0.5,
                    max_tokens: 2000,
                    presence_penalty: 0.1,
                    temperature: 0,
                    top_p: 1,
                    model_name: "text-davinci-003",
                }

                try {
                    const response = await openai.createCompletion({
                        model: defaultModelParams.model_name,
                        prompt: prompt,
                        temperature: defaultModelParams.temperature, // Higher values means the model will take more risks.
                        max_tokens: defaultModelParams.max_tokens, // The maximum number of tokens to generate in the completion. 
                        top_p: defaultModelParams.top_p, // alternative to sampling with temperature, called nucleus sampling
                        frequency_penalty: defaultModelParams.frequency_penalty, //decreasing the model's likelihood to repeat the same line verbatim.
                        presence_penalty: defaultModelParams.presence_penalty, // increasing the model's likelihood to talk about new topics.
                    });
                    console.log(JSON.stringify(response.data.choices));
                    let inputitem = {
                        room_id: item.room_id,
                        timestamp: now.valueOf(),

                        message: `${response.data.choices[0].text.replace("\n\n", "")}`,
                        user_id: "chatgpt",
                        name: item.name,
                    };

                    await sendMessage(result, inputitem);

                } catch (error) {
                    console.log(error);
                    const inputitem = {
                        room_id: item.room_id,
                        timestamp: now.valueOf(),
                        message: `sorry, something wrong:${error.response.status}`,
                        user_id: "chatgpt",
                        name: item.name,
                    };
                    await sendMessage(result, inputitem);
                }


                var deleteParams = {
                    QueueUrl: queueUrl,
                    ReceiptHandle: qMessage.receiptHandle
                };
                await sqs.deleteMessage(deleteParams).promise();
                resolve2("ok")
            }
            catch (e) {
                console.log(e);
                reject2()
            }
        })
    }, Promise.resolve())


}
