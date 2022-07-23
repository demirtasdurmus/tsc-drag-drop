import Component from "./baseComponent";
import ProjectItem from "./projectItem";
import AutoBind from "../decorators/autobind";
import { Project, ProjectStatus } from "../models/project";
import { DragTarget } from "../models/dragDrop";
import { projectState } from "../state/projectState";


// project list class extending Component
export default class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
        super("project-list", "app", false, `${type}-projects`)
        this.assignedProjects = [];

        this.configure()
        this.renderContent();
    }

    @AutoBind
    handleDragOver(event: DragEvent): void {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add("droppable")
        }
    };

    @AutoBind
    handleDrop(event: DragEvent): void {
        const projectId = +event.dataTransfer!.getData("text/plain");
        projectState.moveProject(projectId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
    };

    @AutoBind
    handleDragLeave(event: DragEvent): void {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove("droppable")
    };

    configure() {
        this.element.addEventListener("dragover", this.handleDragOver);
        this.element.addEventListener("dragleave", this.handleDragLeave);
        this.element.addEventListener("drop", this.handleDrop);
        // set up a listener
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(p => {
                if (this.type === "active") {
                    return p.status === ProjectStatus.Active;
                }
                return p.status === ProjectStatus.Finished;
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        })
    };

    renderContent() {
        // assign an id to ul to reference later
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listId;

        // populate h2 element
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS"
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        // reset content before every rerender
        listEl.innerText = '';
        for (const projectItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul")!.id, projectItem)
        }
    }

}