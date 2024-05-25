Deno.serve({
  port: 8081,
  hostname: "0.0.0.0",
}, (req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, {
      status: 501,
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("open", () => {
    console.log("Client connected!");
  });

  return response;
});
