import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: "*",
    },
    transports: ["websocket"],
})

export class SocketGateway extends Server implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    handleDisconnect(client: Socket) {
        console.log("Client disconnected: ", client.id);
        this.server.emit("driver_disconnected", { id_socket: client.id });
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log("Client connected: ", client.id);
    }

    @SubscribeMessage("message")
    handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        console.log("Message received: ", data);
        this.server.emit("message", 'Bien gracias');
    }

    @SubscribeMessage("change_driver_position")
    handleChangeDriverPosition(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        console.log("Nuevas posicion: ", data);
        this.server.emit("new_driver_position", { id_socket : client.id, id: data.id, lat: data.lat, lng: data.lng });
    }

}