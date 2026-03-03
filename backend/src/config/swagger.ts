import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export const setupSwagger = (app: Express, port: number) => {
  const swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "OmniMarket API",
      version: "1.0.0",
      description: "API do Marketplace OmniMarket",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Servidor de desenvolvimento",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "uuid-user" },
            name: { type: "string", example: "Luigi" },
            email: { type: "string", example: "user@email.com" },
            role: { type: "string", example: "BUYER | SELLER | ADMIN" },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "user@email.com" },
            password: { type: "string", example: "123456" },
          },
        },

        LoginResponse: {
          type: "object",
          properties: {
            token: { type: "string", example: "jwt.token.aqui" },
          },
        },

        Category: {
          type: "object",
          properties: {
            id: { type: "string", example: "uuid-category" },
            name: { type: "string", example: "Eletrônicos" },
          },
        },

        Product: {
          type: "object",
          properties: {
            id: { type: "string", example: "uuid-product" },
            name: { type: "string", example: "Notebook Gamer" },
            description: { type: "string", example: "RTX 4060, 16GB RAM" },
            price: { type: "number", example: 4999.99 },
            imageUrl: { type: "string", example: "https://image.com/img.png" },
            categoryId: { type: "string", example: "uuid-category" },
            sellerId: { type: "string", example: "uuid-seller" },
          },
        },

        SellerProfile: {
          type: "object",
          properties: {
            id: { type: "string" },
            storeName: { type: "string", example: "Loja do Luigi" },
            approved: { type: "boolean", example: false },
          },
        },
      },
    },

    security: [{ bearerAuth: [] }],

    paths: {
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login do usuário",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Login realizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LoginResponse" },
                },
              },
            },
          },
        },
      },

      "/categories": {
        get: {
          tags: ["Categories"],
          summary: "Listar categorias",
          responses: {
            200: {
              description: "Lista de categorias",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Category" },
                  },
                },
              },
            },
          },
        },
      },

      "/products": {
        get: {
          tags: ["Products"],
          summary: "Listar todos os produtos",
          responses: {
            200: {
              description: "Lista de produtos",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
        },

        post: {
          tags: ["Products"],
          summary: "Criar produto (Seller)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          responses: {
            201: { description: "Produto criado" },
          },
        },
      },

      "/products/me": {
        get: {
          tags: ["Products"],
          summary: "Listar meus produtos (Seller)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Lista de produtos do seller",
            },
          },
        },
      },

      "/products/{id}": {
        put: {
          tags: ["Products"],
          summary: "Atualizar produto",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Produto atualizado" },
          },
        },

        delete: {
          tags: ["Products"],
          summary: "Deletar produto",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Produto removido" },
          },
        },
      },

      "/seller/profile": {
        get: {
          tags: ["Seller"],
          summary: "Ver perfil de vendedor",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Perfil do vendedor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SellerProfile" },
                },
              },
            },
          },
        },
      },

      "/seller/approve/{id}": {
        patch: {
          tags: ["Admin"],
          summary: "Aprovar vendedor (Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Vendedor aprovado" },
          },
        },
      },
    },
  };

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(`📘 Swagger rodando em: http://localhost:${port}/docs`);
};