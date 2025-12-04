import { FanficProject, OriginalWork } from './types';
import { PRESET_ORIGINAL_WORKS } from './constants';

const PROJECT_KEY = 'novelmind_projects';
const ORIGINAL_WORK_KEY = 'novelmind_originals';

// Projects
export const getProjects = (): FanficProject[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(PROJECT_KEY);
    return data ? JSON.parse(data) : [];
};

export const getProject = (id: string): FanficProject | undefined => {
    const projects = getProjects();
    return projects.find((p) => p.id === id);
};

export const saveProject = (project: FanficProject): void => {
    const projects = getProjects();
    const index = projects.findIndex((p) => p.id === project.id);

    if (index >= 0) {
        projects[index] = project;
    } else {
        projects.push(project);
    }

    localStorage.setItem(PROJECT_KEY, JSON.stringify(projects));
    // Dispatch event for sidebar update
    window.dispatchEvent(new Event('project-updated'));
};

export const deleteProject = (id: string): void => {
    const projects = getProjects();
    const filtered = projects.filter((p) => p.id !== id);
    localStorage.setItem(PROJECT_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('project-updated'));
};

// Original Works
export const getCustomOriginals = (): OriginalWork[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(ORIGINAL_WORK_KEY);
    return data ? JSON.parse(data) : [];
};

export const getAllOriginalWorks = (): OriginalWork[] => {
    const custom = getCustomOriginals();
    return [...PRESET_ORIGINAL_WORKS, ...custom];
};

export const saveOriginalWork = (work: OriginalWork): void => {
    const works = getCustomOriginals();
    const index = works.findIndex((w) => w.id === work.id);

    if (index >= 0) {
        works[index] = work;
    } else {
        works.push(work);
    }

    localStorage.setItem(ORIGINAL_WORK_KEY, JSON.stringify(works));
};
