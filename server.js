import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server is running on ws://localhost:8080");

const clients = new Set();

wss.on("connection", (ws) => {
  console.log("Novo cliente conectado!");

  // Adiciona o cliente à lista
  clients.add(ws);

  ws.send("Bem-vindo ao servidor WebSocket! Envie mensagens para começar.");

  ws.on("message", (data) => {
    try{
      const { nome, message } = JSON.parse(data); 


      console.log(`Mensagem recebida de ${nome}: ${message}`);

      clients.forEach((client) => {
        if (client !== ws) {
          client.send(`${nome} diz: ${message}`);
        }
      });
    } catch (error){
      console.error("Erro ao processar a mensagem:", error);
    }
  });

  ws.on("close", () => {
    console.log("Cliente desconectado.");

    clients.delete(ws);
  });
});