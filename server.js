import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server is running on ws://localhost:8080");

const clients = new Map(); // Nome -> WebSocket

wss.on("connection", (ws) => {
  console.log("Novo cliente conectado!");

  ws.on("message", (data) => {
    try{
      const { name, message: msg } = JSON.parse(data);
    // Check if the client is already in the map
    if (!clients.has(name)) {
      clients.set(name, ws);
      console.log(`${name} has joined the chat`);

      // Send a welcome message to the client
      ws.send("Bem-vindo ao servidor WebSocket! Envie 'private <nome> <mensagem>' para mensagens privadas.");
    }
    console.log(`Mensagem recebida de ${name}: ${msg}`);

    if (msg.startsWith("private")) {
      const [_, recipient, ...rest] = msg.split(" ");
      const privateMessage = rest.join(" ");
      
      // Verifica se o destinatário está conectado
      const client = clients.get(recipient);
      if (client) {
        client.send(`Mensagem privada de ${name}: ${privateMessage}`);
        ws.send(`Mensagem privada enviada para ${recipient}`);
      } else {
        ws.send(`Cliente ${recipient} não encontrado.`);
      }

    }else {
      clients.forEach((client) => {
        if (client !== ws) {
          client.send(`${name} diz: ${msg}`);
        }
      });
    }
     
    } catch (error){
      console.error("Erro ao processar a mensagem:", error);
    }
  });

  ws.on("close", () => {
    console.log("Cliente desconectado.");
    // Remove o cliente da lista quando ele desconectar
    clients.forEach((client, nome) => {
      if (client === ws) {
        clients.delete(nome);
      }
    });
  });
});