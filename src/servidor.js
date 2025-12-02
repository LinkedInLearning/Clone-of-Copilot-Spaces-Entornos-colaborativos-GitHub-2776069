import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


const server = new McpServer({
    name: "Verificador de Contraseñas",
    version: "1.0.0"
});


async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main();
