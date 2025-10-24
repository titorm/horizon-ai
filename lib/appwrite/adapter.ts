import { Databases, ID, TablesDB } from 'node-appwrite';

/**
 * A lightweight adapter that exposes the legacy Databases method names
 * (createDocument, listDocuments, getDocument, updateDocument, deleteDocument)
 * but delegates to TablesDB's object-parameter API when available.
 */
export class AppwriteDBAdapter {
  private databases: Databases | TablesDB;
  private isTablesDB: boolean;

  constructor(databases: Databases | TablesDB) {
    this.databases = databases;
    this.isTablesDB = (databases as any).listRows !== undefined;

    if (this.isTablesDB) {
      console.log('✅ Using TablesDB API');
    } else {
      console.log('ℹ️  Using legacy Databases API');
    }
  }

  /**
   * Check if TablesDB is being used
   */
  public usingTablesDB(): boolean {
    return this.isTablesDB;
  }

  // listDocuments -> listRows
  async listDocuments(databaseId: string, collectionId: string, queries?: any) {
    try {
      // If wrapped object has listRows, use it
      if (this.isTablesDB) {
        const res = await (this.databases as any).listRows({
          databaseId,
          tableId: collectionId,
          queries,
        });
        // normalize to legacy shape
        return { documents: res.rows, total: res.total };
      }

      // fallback to original
      return await (this.databases as any).listDocuments(databaseId, collectionId, queries);
    } catch (error) {
      console.error(`Error listing documents from ${collectionId}:`, error);
      throw error;
    }
  }

  // getDocument -> getRow
  async getDocument(databaseId: string, collectionId: string, documentId: string) {
    try {
      if (this.isTablesDB) {
        const res = await (this.databases as any).getRow({
          databaseId,
          tableId: collectionId,
          rowId: documentId,
        });
        return res;
      }

      return await (this.databases as any).getDocument(databaseId, collectionId, documentId);
    } catch (error) {
      console.error(`Error getting document ${documentId} from ${collectionId}:`, error);
      throw error;
    }
  }

  // createDocument -> createRow
  async createDocument(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: any,
    permissions?: string[],
  ) {
    try {
      // If TablesDB is available
      if (this.isTablesDB) {
        const rowId = documentId || ID.unique();
        const res = await (this.databases as any).createRow({
          databaseId,
          tableId: collectionId,
          rowId,
          data,
          permissions,
        });
        return res;
      }

      return await (this.databases as any).createDocument(databaseId, collectionId, documentId, data, permissions);
    } catch (error) {
      console.error(`Error creating document in ${collectionId}:`, error);
      throw error;
    }
  }

  // updateDocument -> updateRow
  async updateDocument(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: any,
    permissions?: string[],
  ) {
    try {
      if (this.isTablesDB) {
        const res = await (this.databases as any).updateRow({
          databaseId,
          tableId: collectionId,
          rowId: documentId,
          data,
          permissions,
        });
        return res;
      }

      return await (this.databases as any).updateDocument(databaseId, collectionId, documentId, data, permissions);
    } catch (error) {
      console.error(`Error updating document ${documentId} in ${collectionId}:`, error);
      throw error;
    }
  }

  // deleteDocument -> deleteRow
  async deleteDocument(databaseId: string, collectionId: string, documentId: string) {
    try {
      if (this.isTablesDB) {
        const res = await (this.databases as any).deleteRow({
          databaseId,
          tableId: collectionId,
          rowId: documentId,
        });
        return res;
      }

      return await (this.databases as any).deleteDocument(databaseId, collectionId, documentId);
    } catch (error) {
      console.error(`Error deleting document ${documentId} from ${collectionId}:`, error);
      throw error;
    }
  }
}

export default AppwriteDBAdapter;
