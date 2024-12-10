import { WebSocket } from "ws";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Qual é o seu nome? ", (nome) => {

  // Conectar ao servidor WebSocket
  const ws = new WebSocket("ws://localhost:8080");

  ws.on("open", () => {
    console.log(`Conectado ao servidor WebSocket como ${nome}.`);
    console.log("Digite uma mensagem para enviar ao servidor (digite 'exit' para fechar a conexão):");
  });

  rl.on("line", (data) => {
    const message = data.toString().trim();

    if(message === 'exit'){
      console.log("Fechando a conexão...");
      ws.close(); 
      rl.close(); 
      process.exit();
    } else {
      ws.send(JSON.stringify({ nome, message })); // Envia nome e mensagem ao servidor
    }
  });

  ws.on("message", (data) => {
    console.log(`Resposta do servidor: ${data}`);
  });

  ws.on("close", () => {
    console.log("Conexão encerrada.");
  });
});