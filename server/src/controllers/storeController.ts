// Importerar nödvändiga (externa) typer från Express
// Importerar interna klasser: ApiClient, ProductMapper och CategoryMapper
// Importerar CustomError-klass för att kunna kasta egna fel
import { NextFunction, Request, Response } from 'express';
import { ApiClient } from '../services/apiClient.js';
import { ProductMapper } from '../services/productMapper.js';
import { CategoryMapper } from '../services/categoryMapper.js';
import { OrderService } from '../services/orderService.js';
import { CustomError } from '../middleware/customError.js';

/**
 * StoreController
 * --------------
 * Hanterar förfrågningar (requests) relaterade till både produkter och kategorier.
 * Använder ApiClient för API-anrop, samt ProductMapper och CategoryMapper
 * för att omvandla rådata till interna strukturer.
 */
export class StoreController {
  /**
   * Konstruktorn tar emot instanser av ApiClient, ProductMapper och CategoryMapper.
   * Dessa lagras som privata egenskaper i klassen för att enbart användas internt.
   */
  constructor(
    private apiClient: ApiClient,
    private productMapper: ProductMapper,
    private categoryMapper: CategoryMapper,
    private orderService: OrderService
  ) {}

  /**
   * getProductById
   * --------------
   * Hämtar en enskild produkt baserat på det ID som skickas i URL-parametern (req.params.id).
   * 1. Validerar att ID är ett giltigt nummer.
   * 2. Anropar ApiClient för att hämta produktdata.
   * 3. Använder ProductMapper för att mappa rådata till en intern produktstruktur.
   * 4. Skickar resultatet som JSON.
   */
  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      // Hämtar ID från URL-parametrarna
      const { id } = req.params;

      // En validering som säkerställer att ID är ett numeriskt värde
      if (!id || isNaN(Number(id))) {
        throw new CustomError('Invalid ID paramater, 400');
      }

      // Anropar ApiClient för att hämta produktdata
      const response = await this.apiClient.getProductById(Number(id));

      // Använder ProductMapper för att omvandla (mappa) rådata till en intern produktstruktur
      const product = this.productMapper.mapProduct(response.data);

      // Skickar den färdigmappade produkten tillbaka som JSON-svar till klienten
      res.json(product);
    } catch (error) {
      // Vid fel skickas det vidare till en central errorHandler via next(error)
      next(error);
    }
  }

  /**
   * getAllProducts
   * --------------
   * Hämtar en lista av alla produkter.
   * 1. Anropar ApiClient för att hämta en lista av produkter.
   * 2. Mappar varje objekt i listan med ProductMapper.
   * 3. Skickar tillbaka listan av mappade produkter som JSON.
   */
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const perPage = Number(req.query.per_page) || 12;
      // Hämtar en lista av produkter via ApiClient
      const response = await this.apiClient.getProducts(page, perPage);

      // Mappar varje produkt i svaret genom ProductMapper till den interna produktstrukturen
      const products = response.data.map((p) =>
        this.productMapper.mapProduct(p)
      );

      const totalPages = Number(response.headers['x-wp-totalpages']) || 1;
      const totalProducts = Number(response.headers['x-wp-total']) || 0;

      // Skickar en array av mappade produkter som svar
      res.json({ products, totalPages, totalProducts, currentPage: page });
    } catch (error) {
      // Vid fel skickas det vidare till en central errorHandler via next(error)
      next(error);
    }
  }

  /**
   * getProductCategory
   * ------------------
   * Hämtar alla produktkategorier.
   * 1. Anropar ApiClient för att få tillbaka en lista av kategorier.
   * 2. Mappar varje kategori med CategoryMapper.
   * 3. Skickar tillbaka den mappade listan som JSON.
   */
  async getProductCategory(req: Request, res: Response, next: NextFunction) {
    try {
      // Hämta kategoridata via ApiClient
      const response = await this.apiClient.getProductCategories();

      // Mappar varje kategori i svaret genom CategoryMapper till en intern kategori-struktur
      const category = response.data.map((c) =>
        this.categoryMapper.mapCategory(c)
      );

      // Skickar tillbaka listan av kategorier som JSON
      res.json(category);
    } catch (error) {
      // Vid fel skickas det vidare till en central errorHandler via next(error)
      next(error);
    }
  }

  /**
   * createOrder
   * --------------
   * 1. Validerar att varukorgen inte är tom.
   * 2. Anropar OrderService för att skapa en order i WooCommerce.
   * 3. Returnerar en checkout-URL där kunden kan slutföra köpet.
   */
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { cart, billing, shipping } = req.body;

      // En validering som säkerställer att varukorgen innehåller produkter
      if (!cart || cart.length === 0) {
        throw new CustomError('Cart is empty or invalid', 400);
      }

      const response = await this.orderService.createOrder({
        cart,
        billing,
        shipping,
      });

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
