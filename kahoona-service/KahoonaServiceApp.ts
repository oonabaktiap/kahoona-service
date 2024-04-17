import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { decrypt } from 'src/service/kahoona-decrypt.service';
import { BaseResponse } from 'src/dto/oona.base.response.dto';
import { DecryptRequestDto } from 'src/dto/decrypt.request.dto';
import { HttpStatusCode } from 'axios';


/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
export const decryptHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('into getBaseNoDB')
        return await decryptFunc(event);
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error',
            }),
        };
    }
}



async function decryptFunc(event: APIGatewayProxyEvent) {
    if (event.body) {
        const requestPayload: DecryptRequestDto = JSON.parse(event.body);
        console.log('event.body json object : ', requestPayload);
        const response = await decrypt(requestPayload);

        const baseResponse = new BaseResponse();
        if (response) {
            baseResponse.code = HttpStatusCode.Ok;
            baseResponse.status = 'success';
            baseResponse.data = JSON.stringify(baseResponse);
            baseResponse.message = "decypt successful"
        } else {
            baseResponse.code = -1;
            baseResponse.status = 'failed';
            baseResponse.message = "failed calling kahoona decrypt"
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                baseResponse,
            }),
        };
    }
    return {
        statusCode: 500,
        body: JSON.stringify({
            message: 'body not found',
        }),
    };
}


