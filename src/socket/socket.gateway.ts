import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})

export class SocketGateway extends Server implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server : Server;

    handleDisconnect(client: Socket) {
        console.log("Client disconnected: ", client.id);
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log("Client connected: ", client.id);
    }

}