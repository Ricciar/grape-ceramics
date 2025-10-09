import { NextFunction, Request, Response } from "express";
import { ApiClient } from "../services/apiClient.js";
import { ProductMapper } from "../services/productMapper.js";
import { CategoryMapper } from "../services/categoryMapper.js";
import { OrderService } from "../services/orderService.js";
import { CustomError } from "../middleware/customError.js";

function toBool(val: unknown): boolean {
  if (typeof val === "boolean") return val;
  if (Array.isArray(val)) return toBool(val[0]);
  if (typeof val === "string") {
    const s = val.toLowerCase().trim();
    return s === "true" || s === "1" || s === "yes" || s === "on";
  }
  return false;
}

export class StoreController {
  constructor(
    private apiClient: ApiClient,
    private productMapper: ProductMapper,
    private categoryMapper: CategoryMapper,
    private orderService: OrderService
  ) {
    console.log("✅ StoreController initierad");
  }

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || isNaN(Number(id))) {
        throw new CustomError("Invalid ID parameter", 400);
      }
      const response = await this.apiClient.getProductById(Number(id));
      const product = this.productMapper.mapProduct(response.data);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const perPage = Number(req.query.per_page) || 12;

      // 🟢 Läs in flaggan korrekt
      const includeCourses = toBool(req.query.includeCourses);
      console.log(
        `[SERVER] getAllProducts: includeCourses=${req.query.includeCourses} → ${includeCourses}`
      );

      // Skicka vidare till ApiClient med flaggan
      const response = await this.apiClient.getProducts(page, perPage, includeCourses);

      // Mappa produkter
      let products = response.data.map((p) => this.productMapper.mapProduct(p));

      // ❌ Tidigare: filtrerade alltid bort kurser
      // 🟢 Nu: filtrerar bara bort dem om includeCourses = false
      if (!includeCourses) {
        products = products.filter(
          (p) => !p.categories.some((c) => c.name.toLowerCase() === "kurser")
        );
      }

      const totalPages = Number(response.headers["x-wp-totalpages"]) || 1;
      const totalProducts = products.length;

      res.json({ products, totalPages, totalProducts, currentPage: page });
    } catch (error) {
      next(error);
    }
  }

  async getAllCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const perPage = Number(req.query.per_page) || 12;
      const response = await this.apiClient.getCourses(page, perPage);
      const courses = response.data.map((p) => this.productMapper.mapProduct(p));
      const totalPages = Number(response.headers["x-wp-totalpages"]) || 1;
      const totalProducts = courses.length;

      res.json({ products: courses, totalPages, totalProducts, currentPage: page });
    } catch (error) {
      next(error);
    }
  }

  async getProductCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await this.apiClient.getProductCategories();
      const category = response.data.map((c) => this.categoryMapper.mapCategory(c));
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { cart, billing, shipping } = req.body;
      if (!cart || cart.length === 0) {
        throw new CustomError("Cart is empty or invalid", 400);
      }
      const response = await this.orderService.createOrder({ cart, billing, shipping });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
