#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class SupabaseMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'supabase-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize Supabase connection from environment variables
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;
    
    if (url && key) {
      this.supabase = createClient(url, key);
      console.error('Supabase connection initialized from environment variables');
    } else {
      this.supabase = null;
      console.error('Supabase environment variables not found, please call init_supabase tool');
    }
    
    this.setupTools();
  }

  setupTools() {
    // Tool to initialize Supabase connection
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          ToolSchema.parse({
            name: 'query_supabase',
            description: 'Execute a SQL query on Supabase',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'SQL query to execute'
                }
              },
              required: ['query']
            }
          }),
          ToolSchema.parse({
            name: 'init_supabase',
            description: 'Initialize Supabase connection',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'Supabase project URL'
                },
                key: {
                  type: 'string',
                  description: 'Supabase anonymous key'
                }
              },
              required: ['url', 'key']
            }
          })
        ],
      };
    });

    // Tool execution handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'init_supabase') {
        const { url, key } = request.params.arguments;
        this.supabase = createClient(url, key);
        return {
          content: [
            {
              type: 'text',
              text: `Supabase connection initialized successfully with URL: ${url}`
            }
          ]
        };
      }

      if (request.params.name === 'query_supabase') {
        if (!this.supabase) {
          throw new Error('Supabase connection not initialized. Call init_supabase first.');
        }

        const { query } = request.params.arguments;
        
        // Simple test query to verify connection
        const { data, error } = await this.supabase.from('').select('*').limit(1);
        
        if (error) {
          throw new Error(`Supabase connection test failed: ${error.message}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: `Supabase connection successful. Server responded with: ${JSON.stringify(data, null, 2)}`
            }
          ]
        };
      }

      throw new Error(`Unknown tool: ${request.params.name}`);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Supabase MCP server running on stdio');
  }
}

const server = new SupabaseMCPServer();
server.run().catch(console.error);