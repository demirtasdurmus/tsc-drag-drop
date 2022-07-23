import { Project, ProjectStatus } from "../models/project";

// create a custom listener function  type
type Listener<T> = (items: T[]) => void;

// create an inheritable base class for app State
class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(fn: Listener<T>) {
        this.listeners.push(fn);
    }
}

// create a class fro application state
export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super()
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState()
        return this.instance;
    }

    // method to generate a unique id
    generateUniqueId = (length: number) => {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""))
    }

    addProject(title: string, description: string, people: number) {
        const newProject = new Project(this.generateUniqueId(16), title, description, people, ProjectStatus.Active)
        // push the newly created project to the projects array
        this.projects.push(newProject);
        this.updateListeners();
    }

    moveProject(projectId: number, newStatus: ProjectStatus) {
        const project = this.projects.find(el => el.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }

    updateListeners() {
        // call registered listener functions
        for (const listenerFn of this.listeners) {
            // call each fn with a shallow copy of projects array
            listenerFn(this.projects.slice())
        }
    }
}

export const projectState = ProjectState.getInstance();