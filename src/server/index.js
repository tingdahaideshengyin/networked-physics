import { Server } from "http";
import * as Udp from "web-udp";
import * as Simulation from "../../lib/common/simulation";
import * as Hrtime from "./util/hrtime";
import * as Loop from "./loop";

// Simulate world 60 times a second.
const SERVER_TICK_RATE = 1 / 60;
// Send world state 20 times a seciond.
const SERVER_SEND_RATE = 1 / 20;

const PORT = process.env.PORT || 3000;

const server = new Server();
const udp = new Udp.Server({ server });
const clients = [];

const simulation = Simulation.create(
  Loop.create(SERVER_TICK_RATE)
);

const forEachWith =
  iteratee => array => value => {
    for (let i = 0; i < array.length; i++) {
      iteratee(array[i], value);
    }
  };

const send =
  (client, packet) =>
    client.connection.send(packet);

const sendClients = forEachWith(send)(clients);

const sendSnapshot =
  (simulation) =>
    simulation
      |> JSON.stringify
      |> sendClients;

setInterval(
  () => sendSnapshot(simulation)
, SERVER_SEND_RATE * 1000);

const onMessage =
  message =>
    simulation.handle(
      ...JSON.parse(message)
    );

const onConnection =
  connection => {
    connection.messages.subscribe(onMessage);
    clients.push({ connection, init: process.hrtime() });
  };

udp.connections.subscribe(onConnection);

server.listen(PORT);

console.log(`Game server listening on port ${PORT}.`);
