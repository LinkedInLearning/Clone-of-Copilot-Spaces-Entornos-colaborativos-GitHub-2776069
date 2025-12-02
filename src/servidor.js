import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


const server = new McpServer({
    name: "Verificador de Contraseñas",
    version: "1.0.0",
    capabilities: {
        tools: {},
    }
});

server.tool(
    "verificar-password",
    "analiza tu password y verifica su calidad",
    {
        password: z.string()
    },
    {
        title: "verificar password",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
    }, (params) => {
        try {
            const calidad = verificarPassword(params);
            return {
                content: [
                    { type: "text", text: `Tu password es de calidad ${calidad}.` }
                ]
            };
        }
        catch (error) {
            return {
                content: [
                    { type: "text", text: `error : ${error?.message ?? String(error)}` }
                ]
            };
        }

    }
)


function verificarPassword(params) {
    const password = params.password;
    let nivel = 0;

    // Criterio 1: Mínimo 12 caracteres
    if (password.length >= 12) {
        nivel++;
    }

    // Criterio 2: Contiene mayúsculas
    if (/[A-Z]/.test(password)) {
        nivel++;
    }

    // Criterio 3: Contiene minúsculas
    if (/[a-z]/.test(password)) {
        nivel++;
    }

    // Criterio 4: Contiene números
    if (/[0-9]/.test(password)) {
        nivel++;
    }

    // Criterio 5: Contiene caracteres especiales
    if (/[!@#$%^&*]/.test(password)) {
        nivel++;
    }

    // Clasificar por nivel
    if (nivel <= 1) return "débil";
    if (nivel <= 3) return "media";
    return "fuerte";
}

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main();
