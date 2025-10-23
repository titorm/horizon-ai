import { Databases, ID, TablesDB } from 'node-appwrite';

/**
 * A lightweight adapter that exposes the legacy Databases method names
 * (createDocument, listDocuments, getDocument, updateDocument, deleteDocument)
 * but delegates to TablesDB's object-parameter API when available.
 */
export class AppwriteDBAdapter {
  private databases: Databases | TablesDB;

  constructor(databases: Databases | TablesDB) {
    this.databases = databases;
  }

  // listDocuments -> listRows
  async listDocuments(databaseId: string, collectionId: string, queries?: any) {
    // If wrapped object has listRows, use it
    if ((this.databases as any).listRows) {
      const res = await (this.databases as any).listRows({
        databaseId,
        tableId: collectionId,
        queries,
      });
      // normalize to legacy shape
      return { documents: res.rows };
    }

    // fallback to original
    return await (this.databases as any).listDocuments(databaseId, collectionId, queries);
  }

  // getDocument -> getRow
  async getDocument(databaseId: string, collectionId: string, documentId: string) {
    if ((this.databases as any).getRow) {
      const res = await (this.databases as any).getRow({
        databaseId,
        tableId: collectionId,
        rowId: documentId,
      });
      return res;
    }

    return await (this.databases as any).getDocument(databaseId, collectionId, documentId);
  }

  // createDocument -> createRow
  async createDocument(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: any,
    permissions?: string[],
  ) {
    // If TablesDB is available
    if ((this.databases as any).createRow) {
      const rowId = documentId || ID.unique();
      const res = await (this.databases as any).createRow({
        databaseId,
        tableId: collectionId,
        rowId,
        data,
      });
      return res;
    }

    return await (this.databases as any).createDocument(databaseId, collectionId, documentId, data, permissions);
  }

  // updateDocument -> updateRow
  async updateDocument(databaseId: string, collectionId: string, documentId: string, data: any) {
    if ((this.databases as any).updateRow) {
      const res = await (this.databases as any).updateRow({
        databaseId,
        tableId: collectionId,
        rowId: documentId,
        data,
      });
      return res;
    }

    return await (this.databases as any).updateDocument(databaseId, collectionId, documentId, data);
  }

  // deleteDocument -> deleteRow
  async deleteDocument(databaseId: string, collectionId: string, documentId: string) {
    if ((this.databases as any).deleteRow) {
      const res = await (this.databases as any).deleteRow({
        databaseId,
        tableId: collectionId,
        rowId: documentId,
      });
      return res;
    }

    return await (this.databases as any).deleteDocument(databaseId, collectionId, documentId);
  }
}

export default AppwriteDBAdapter;
