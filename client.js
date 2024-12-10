import { WebSocket } from "ws";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Qual é o seu nome? ", (name) => {
  // Now that we have the name, we can connect to the WebSocket server
  const ws = new WebSocket("ws://localhost:8080");

  ws.on("open", () => {
    console.log(`Conectado ao servidor WebSocket como ${name}.`);
    console.log("Digite uma mensagem para enviar ao servidor (digite 'exit' para fechar a conexão):");

    ws.send(JSON.stringify({ name, message: 'Nome do usuário' }));

    rl.on("line", (data) => {
      const message = data.toString().trim();
  
      if(message === 'exit'){
        console.log("Fechando a conexão...");
        ws.close(); 
        rl.close(); 
        process.exit();
      } else {
        ws.send(JSON.stringify({ name, message })); // Envia nome e mensagem ao servidor
      }
    });
  });


  ws.on("message", (data) => {
    console.log(`Resposta do servidor: ${data}`);
  });

  ws.on("close", () => {
    console.log("Conexão encerrada.");
  });
});