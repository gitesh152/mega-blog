import {
  Client,
  Account,
  ID,
  Databases,
  Storage,
  TablesDB,
  Query,
  Permission,
  Role,
} from "appwrite";
import conf from "../conf/conf";
import type { PostRow, PostWithSlug, PostBase } from "../types/post";

class StorageService {
  client: Client = new Client();
  account: Account;
  databases: Databases;
  tablesDb: TablesDB;
  bucket: Storage;

  // Cache for JWT to avoid creating a new one for each image
  private jwtCache: { token: string; timestamp: number } | null = null;
  private readonly jwtTTL = 3600000; // 1 hour in milliseconds

  // Cache for blob URLs to avoid re-fetching the same image
  private readonly blobUrlCache = new Map<string, string>();

  constructor() {
    this.client
      .setEndpoint(conf.appwriteEndpoint)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
    this.tablesDb = new TablesDB(this.client);
    this.bucket = new Storage(this.client);
  }

  // Get or create JWT, reusing cached one if still valid
  private async getOrCreateJWT(): Promise<string> {
    const now = Date.now();

    if (
      this.jwtCache &&
      now - this.jwtCache.timestamp < this.jwtTTL
    ) {
      return this.jwtCache.token;
    }

    const { jwt } = await this.account.createJWT();
    this.jwtCache = { token: jwt, timestamp: now };
    return jwt;
  }

  // Clear cached JWT (useful on logout)
  clearJWTCache(): void {
    this.jwtCache = null;
  }

  // Clear all blob URL cache (useful on logout to free memory)
  clearBlobUrlCache(): void {
    this.blobUrlCache.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    this.blobUrlCache.clear();
  }

  private async getRow<T>(rowId: string): Promise<T | false> {
    try {
      const row = await this.tablesDb.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        rowId,
      });

      return row as unknown as T;
    } catch (error) {
      console.log("Appwrite storage service :: getRow :: error", error);
      return false;
    }
  }

  private async listRows<T>(
    queries: string[] = []
  ): Promise<{ rows: T[] } | false> {
    try {
      const res = await this.tablesDb.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        queries,
      });

      return {
        ...res,
        rows: res.rows as unknown as T[],
      };
    } catch (error) {
      console.log("Appwrite storage service :: listRows :: error", error);
      return false;
    }
  }

  // ✅ CREATE
  async createPost(data: PostWithSlug): Promise<PostRow | false> {
    try {
      const row = await this.tablesDb.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        rowId: data.slug,
        permissions: [
          Permission.read(Role.users()),
          Permission.update(Role.user(data.userId)),
          Permission.delete(Role.user(data.userId)),
        ],
        data: {
          title: data.title,
          content: data.content,
          featuredImage: data.featuredImage,
          status: data.status,
          userId: data.userId,
        },
      });

      return row as unknown as PostRow;
    } catch (error) {
      console.log("Appwrite storage service :: createPost :: error", error);
      return false;
    }
  }

  // ✅ UPDATE
  async updatePost(
    slug: string,
    data: Partial<PostBase>
  ): Promise<PostRow | false> {
    try {
      const row = await this.tablesDb.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        rowId: slug,
        data,
      });

      return row as unknown as PostRow;
    } catch (error) {
      console.log("Appwrite storage service :: updatePost :: error", error);
      return false;
    }
  }

  // ✅ DELETE
  async deletePost(slug: string): Promise<boolean> {
    try {
      await this.tablesDb.deleteRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        rowId: slug,
      });
      return true;
    } catch (error) {
      console.log("Appwrite storage service :: deletePost :: error", error);
      return false;
    }
  }

  // ✅ GET SINGLE
  async getPostBySlug(slug: string): Promise<PostRow | false> {
    return this.getRow<PostRow>(slug);
  }

  // ✅ GET ALL
  async getPosts(
    queries = [Query.equal("status", "active")]
  ): Promise<{ rows: PostRow[] } | false> {
    return this.listRows<PostRow>(queries);
  }

  // ✅ FILE UPLOAD
  async uploadFile(file: File, userId: string) {
    try {
      return await this.bucket.createFile({
        bucketId: conf.appwriteBucketId,
        fileId: ID.unique(),
        file,
        permissions: [
          Permission.read(Role.users()),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ],
      });
    } catch (error) {
      console.log("Appwrite storage service :: uploadFile :: error", error);
      return false;
    }
  }

  // ✅ FILE DELETE
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      await this.bucket.deleteFile({
        bucketId: conf.appwriteBucketId,
        fileId,
      });
      return true;
    } catch (error) {
      console.log("Appwrite storage service :: deleteFile :: error", error);
      return false;
    }
  }

  // ✅ GET FILE URL - returns authenticated URL that may require JWT headers
  // Used by PostForm to preview images during editing
  getFile(fileId: string): string {
    try {
      return this.bucket.getFileView({
        bucketId: conf.appwriteBucketId,
        fileId,
      });
    } catch (error) {
      console.log("Appwrite storage service :: getFile :: error", error);
      return "N/A";
    }
  }


  // We use this method to fetch the image as a blob with the user's JWT for authentication, 
  // then create an object URL for the blob to use as the image src. 
  // This is necessary because Appwrite's file URLs require authentication, 
  // and we can't directly use them in an <img> tag without exposing credentials.
  async getAuthenticatedImageSrc(fileId: string): Promise<string | null> {
    try {
      // Return cached blob URL if available
      if (this.blobUrlCache.has(fileId)) {
        return this.blobUrlCache.get(fileId) || null;
      }

      // Get or reuse cached JWT instead of creating a new one
      const jwt = await this.getOrCreateJWT();
      const fileUrl = this.getFile(fileId);

      const response = await fetch(fileUrl, {
        method: "GET",
        headers: {
          "X-Appwrite-Project": conf.appwriteProjectId,
          "X-Appwrite-JWT": jwt,
        },
      });

      if (!response.ok) {
        return null;
      }

      const imageBlob = await response.blob();
      const objectUrl = URL.createObjectURL(imageBlob);

      // Cache the blob URL for future use
      this.blobUrlCache.set(fileId, objectUrl);

      return objectUrl;
    } catch (error) {
      console.log(
        "Appwrite storage service :: getAuthenticatedImageSrc :: error",
        error,
      );
      return null;
    }
  }
}

const storageService = new StorageService();
export default storageService;
