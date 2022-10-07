import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import { DocumentsList } from "../../appwrite";
import { client } from "../../client";
import { AppwriteSDK } from "../../constants";
import { ext } from "../../extensionVariables";
import { AppwriteTreeItemBase } from "../../ui/AppwriteTreeItemBase";
import AppwriteCall from "../../utils/AppwriteCall";
import { CollectionTreeItem } from "./CollectionTreeItem";
import { DocumentTreeItem } from "./DocumentTreeItem";

export class DocumentsTreeItem extends AppwriteTreeItemBase<CollectionTreeItem> {
    constructor(parent: CollectionTreeItem) {
        super(parent, "Documents");
    }

    public async getChildren(): Promise<TreeItem[]> {
        const databaseSdk = new AppwriteSDK.Databases(client);
        const documentList = await AppwriteCall<DocumentsList>(databaseSdk.listDocuments(this.parent.collection.$database, this.parent.collection.$id));
        if (documentList === undefined) {
            return [];
        }

        ext.outputChannel?.append(JSON.stringify(documentList, null, 4));

        const documentTreeItems = documentList.documents.map((document) => new DocumentTreeItem(this, document));
        const headerItem: TreeItem = {
            label: `Total documents: ${documentTreeItems.length}`,
        };
        return [headerItem, ...documentTreeItems];
    }

    collapsibleState = TreeItemCollapsibleState.Collapsed;

    contextValue = "documents";

    iconPath = new ThemeIcon("database");
}
