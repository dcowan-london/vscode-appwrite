import { workspace } from "vscode";
import { initAppwriteClient } from "./client";

export type AppwriteProjectConfiguration = {
    nickname?: string;
    endpoint: string;
    console?: string;
    projectId: string;
    secret: string;
};

export async function getDefaultProject(): Promise<AppwriteProjectConfiguration | undefined> {
    const projects = await getAppwriteProjects();
    return projects?.[0] ?? undefined;
}

export async function getAppwriteProjects(): Promise<AppwriteProjectConfiguration[]> {
    const configuration = workspace.getConfiguration("appwrite");
    const projects = configuration.get("projects");
    if (projects === undefined) {
        configuration.update("projects", []);
        return [];
    }
    return projects as AppwriteProjectConfiguration[];
}

export async function addProjectConfiguration(projectConfig: AppwriteProjectConfiguration): Promise<void> {
    const configuration = workspace.getConfiguration("appwrite");
    const projects = await getAppwriteProjects();

    await configuration.update("projects", [...projects, projectConfig], true);
    await setActiveProjectId(projectConfig.projectId);
}

export async function getActiveProjectId(): Promise<string> {
    const configuration = workspace.getConfiguration("appwrite");
    const projectId = configuration.get<string>("activeProjectId");
    return projectId ?? "";
}

export async function getActiveProjectConfiguration(): Promise<AppwriteProjectConfiguration> {
    const configurations = await getAppwriteProjects();
    const activeConfigId = await getActiveProjectId();
    let activeConfig;
    configurations.forEach((config) => {
        if (config.projectId === activeConfigId) {
            activeConfig = config;
        }
    });

    if (activeConfig === undefined) {
        activeConfig = configurations[0];
        setActiveProjectId(configurations[0].projectId);
    }
    return activeConfig;
}

export async function setActiveProjectId(projectId: string): Promise<void> {
    const configuration = workspace.getConfiguration("appwrite");
    await configuration.update("activeProjectId", projectId, true);
    initAppwriteClient(await getActiveProjectConfiguration());
}

export async function updateActiveProjectId(): Promise<void> {
    const projects = await getAppwriteProjects();
    if (projects.length > 0) {
        const configuration = workspace.getConfiguration("appwrite");
        await configuration.update("activeProjectId", projects[0].projectId, true);
        initAppwriteClient(await getActiveProjectConfiguration());
    }
}

export async function removeProjectConfig(projectId: string): Promise<void> {
    const projects = await getAppwriteProjects();

    const activeProjectId = await getActiveProjectId();

    const updatedProjects = projects.filter((project) => project.projectId !== projectId);
    const configuration = workspace.getConfiguration("appwrite");
    await configuration.update("projects", updatedProjects, true);
    await updateActiveProjectId();
}
