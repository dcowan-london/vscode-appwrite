import { Client, Collection, CreatedCollection, CreatedRule, DatabaseClient, Rule } from "../appwrite";
import { AppwriteSDK } from '../constants';
import AppwriteCall from "../utils/AppwriteCall";

export class Database {
    private readonly database: DatabaseClient;

    constructor(client: Client) {
        this.database = new AppwriteSDK.Databases(client);
    }

    public async list(): Promise<any> {
        return await AppwriteCall<any>(this.database.list());
    }

    public async getCollection(collectionDB: string, collectionId: string): Promise<Collection | undefined> {
        return await AppwriteCall<Collection>(this.database.getCollection(collectionDB, collectionId));
    }

    public async deleteDocument(collectionDB:string, collectionId: string, documentId: string): Promise<void> {
        await AppwriteCall(this.database.deleteDocument(collectionDB, collectionId, documentId));
    }

    public async deleteCollection(collectionDB:string, collectionId: string): Promise<void> {
        await AppwriteCall(this.database.deleteCollection(collectionDB, collectionId));
    }

    public async createCollection(collection: CreatedCollection): Promise<void> {
        await AppwriteCall(
            this.database.createCollection(
                collection.name,
                collection.$permissions?.read ?? [],
                collection.$permissions?.write ?? [],
                collection.rules ?? []
            )
        );
    }

    public async updatePermissions(collection: Collection, read: string[], write: string[]): Promise<void> {
        await AppwriteCall(this.database.updateCollection(collection.$database, collection.$id, collection.name, read, write, collection.rules));
    }

    public async createRule(collection: Collection, newRule: CreatedRule): Promise<void> {
        await AppwriteCall(
            this.database.updateCollection(collection.$database, collection.$id, collection.name, collection.$permissions.read, collection.$permissions.write, [
                ...collection.rules,
                newRule,
            ])
        );
    }

    public async removeRule(collection: Collection, ruleToRemove: Rule): Promise<void> {
        const rules = collection.rules.filter((rule) => rule.$id !== ruleToRemove.$id);

        await AppwriteCall(
            this.database.updateCollection(
                collection.$database,
                collection.$id,
                collection.name,
                collection.$permissions.read,
                collection.$permissions.write,
                rules
            )
        );
    }
}
