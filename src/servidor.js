#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


const server = new McpServer({
    name: "Verificador de Contraseñas",
    version: "1.0.0",
    capabilities: {
        tools: {},
    },
});

/// Tool para verificar passwords
server.tool("verificar-password", "analiza tu password y verifica su calidad", {
    password: z.string(),
}, {
    /// pasa mensajes al LLM
    title: "verificar password",
    readOnlyHint: true, // Describe que no es solo lectura
    destructiveHint: false, // esto no destruye nada, no manda alerta
    idempotentHint: false, // si ejecuta muchas veces esto pasa algo? 
    openWorldHint: true, // esto es algo que accede datos externos a lo que hacemos?
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
                { type: "text", text: `error : ${error.message}` }
            ]
        };
    }
    return {};
});


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
    if (nivel <= 1) {
        return "débil";
    } else if (nivel <= 3) {
        return "media";
    } else {
        return "fuerte";
    }
}

/// Inicia el servidor
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main();
