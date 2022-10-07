import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { Database } from "../../appwrite";
import { databaseClient } from "../../client";
import { AppwriteTreeItemBase } from "../../ui/AppwriteTreeItemBase";
import { CollectionTreeItem } from "./CollectionTreeItem";
import { DatabaseTreeItemProvider } from "./DatabaseTreeItemProvider";
import { DocumentsTreeItem } from "./DocumentsTreeItem";
import { PermissionsTreeItem } from "./settings/PermissionsTreeItem";
import { RulesTreeItem } from "./settings/RulesTreeItem";

export class DatabaseTreeItem extends AppwriteTreeItemBase {
    constructor(public database: any, public readonly provider: DatabaseTreeItemProvider) {
        super(undefined, database.name);
    }

    public async getChildren(): Promise<TreeItem[]> {
        // return [new RulesTreeItem(this), new PermissionsTreeItem(this), new DocumentsTreeItem(this)];
        // return [new CollectionTreeItem(this)];
        console.warn(this);
        return [];
    }

    public async refresh(): Promise<void> {
        if (!databaseClient) {
            return;
        }
        this.database = (await databaseClient.list()) ?? this.database;
        this.provider.refreshChild(this);
    }

    collapsibleState = TreeItemCollapsibleState.Collapsed;

    contextValue = "database";

    iconPath = new ThemeIcon("folder");
}
