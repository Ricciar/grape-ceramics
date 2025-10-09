import axios from "axios";
import { config } from "../config/environment.js";
import { Config } from "../config/types/config.js";
import { ProductResponse } from "../controllers/types/product.types.js";
import { CategoryResponse } from "../controllers/types/category.types.js";
import {
  WooCommerceOrderRequest,
  WooCommerceOrderResponse,
} from "../controllers/types/order.types.js";
import NodeCache from "node-cache";

const COURSE_TAG_SLUGS = ["courses-one", "courses-two", "courses-three", "courses-four"];
const COURSE_CATEGORY_SLUGS = ["kurser", "kurs", "course", "courses"];

export class ApiClient {
  private readonly config: Config;
  public cache: NodeCache = new NodeCache({ stdTTL: 300 });

  constructor(customConfig?: Config) {
    this.config = customConfig || {
      apiUrl: config.woocommerceApiUrl,
      woocommerceConsumerKey: config.woocommerceConsumerKey,
      woocommerceConsumerSecret: config.woocommerceConsumerSecret,
    };
  }

  private getAuthConfig() {
    return {
      auth: {
        username: this.config.woocommerceConsumerKey,
        password: this.config.woocommerceConsumerSecret,
      },
      timeout: 30000,
    };
  }

  private normalizePrice(value: any): string {
    if (value === undefined || value === null || value === "") return "";
    const num = Number(value);
    if (isNaN(num) || num === 0) return "";

    if (num > 10000) {
      return (num / 100).toFixed(2).replace(/\.00$/, "");
    }

    return String(num);
  }

  private pickNumericPrice(product: any): string {
    const storeApiSale = product?.prices?.sale_price;
    const storeApiPrice = product?.prices?.price;
    if (storeApiSale) return this.normalizePrice(storeApiSale);
    if (storeApiPrice) return this.normalizePrice(storeApiPrice);

    const restSale = product?.sale_price;
    const restPrice = product?.price;
    const restRegular = product?.regular_price;
    if (restSale) return this.normalizePrice(restSale);
    if (restPrice) return this.normalizePrice(restPrice);
    if (restRegular) return this.normalizePrice(restRegular);
    return "";
  }

  private normalizeProduct<T extends Record<string, any>>(product: T): T {
    return {
      ...product,
      price: this.pickNumericPrice(product),
      regular_price: product?.regular_price
        ? this.normalizePrice(product.regular_price)
        : null,
      sale_price: product?.sale_price
        ? this.normalizePrice(product.sale_price)
        : null,
    };
  }

  private hasCourseTag(product: any): boolean {
    const tags = Array.isArray(product?.tags) ? product.tags : [];
    return tags.some(
      (t: any) =>
        typeof t?.slug === "string" &&
        COURSE_TAG_SLUGS.includes(t.slug.toLowerCase().trim())
    );
  }

  private hasCourseCategory(product: any): boolean {
    const cats = Array.isArray(product?.categories) ? product.categories : [];
    return cats.some((c: any) => {
      const bySlug =
        typeof c?.slug === "string" &&
        COURSE_CATEGORY_SLUGS.includes(c.slug.toLowerCase().trim());
      const byName =
        typeof c?.name === "string" &&
        COURSE_CATEGORY_SLUGS.includes(c.name.toLowerCase().trim());
      return bySlug || byName;
    });
  }

  private isCourseProduct(product: any): boolean {
    return this.hasCourseTag(product) || this.hasCourseCategory(product);
  }

  /**
   * Hämtar produkter. Som standard filtreras kurser bort.
   * Sätt includeCourses=true för att även få med kurser.
   */
  async getProducts(
    page: number = 1,
    perPage: number = 12,
    includeCourses: boolean | string = false
  ): Promise<{ data: ProductResponse[]; headers: any }> {
    // ✅ robust konvertering till boolean
    const includeCoursesBool =
      typeof includeCourses === "boolean"
        ? includeCourses
        : typeof includeCourses === "string"
        ? ["true", "1", "yes", "on"].includes(includeCourses.toLowerCase().trim())
        : false;

    console.log("[API] getProducts includeCourses=", includeCourses, "→", includeCoursesBool);

    const start = Date.now();

    const response = await axios.get(`${this.config.apiUrl}products`, {
      ...this.getAuthConfig(),
      params: {
        page,
        per_page: perPage,
        _fields:
          "id,name,description,short_description,images,categories,tags,variations,attributes,price,regular_price,sale_price,prices,stock_status,stock_quantity",
      },
    });

    const duration = Date.now() - start;
    console.log(`WooCommerce API (products page ${page}) ${duration}ms`);

    const normalized = (response.data as any[]).map((p) => this.normalizeProduct(p));

    const filtered = includeCoursesBool
      ? normalized
      : normalized.filter((p) => !this.isCourseProduct(p));

    if (includeCoursesBool) {
      console.log(`[SHOP] fetched=${normalized.length} (kurser inkluderade ✅)`);
    } else {
      console.log(
        `[SHOP] fetched=${normalized.length} filteredOutCourses=${
          normalized.length - filtered.length
        }`
      );
    }
    console.log("[DEBUG] getProducts() response:", response.data.map((p: any) => ({
  id: p.id,
  name: p.name,
  tags: (p.tags || []).map((t: any) => t.slug)
})));


    return { data: filtered as ProductResponse[], headers: response.headers };
  }

  async getCourses(
    page: number = 1,
    perPage: number = 12
  ): Promise<{ data: ProductResponse[]; headers: any }> {
    const response = await axios.get(`${this.config.apiUrl}products`, {
      ...this.getAuthConfig(),
      params: {
        page,
        per_page: perPage,
        _fields:
          "id,name,description,short_description,images,categories,tags,variations,attributes,price,regular_price,sale_price,prices,stock_status,stock_quantity",
      },
    });

    const normalized = (response.data as any[]).map((p) => this.normalizeProduct(p));
    const onlyCourses = normalized.filter((p) => this.isCourseProduct(p));

    console.log(`[COURSES] fetched=${normalized.length} keptCourses=${onlyCourses.length}`);

    return { data: onlyCourses as ProductResponse[], headers: response.headers };
  }

  async getProductById(id: number): Promise<{ data: ProductResponse }> {
    const response = await axios.get(`${this.config.apiUrl}products/${id}`, this.getAuthConfig());
    return { data: this.normalizeProduct(response.data) as ProductResponse };
  }

  async getProductCategories(): Promise<{ data: CategoryResponse[] }> {
    return axios.get(`${this.config.apiUrl}products/categories`, this.getAuthConfig());
  }

  async createOrder(
    orderData: WooCommerceOrderRequest
  ): Promise<{ data: WooCommerceOrderResponse }> {
    return axios.post(`${this.config.apiUrl}orders`, orderData, this.getAuthConfig());
  }
}
