import Component from "./baseComponent";
import AutoBind from "../decorators/autobind";
import { Project } from "../models/project";
import { Draggable } from "../models/dragDrop";

// project item class extending Component
export default class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    get persons() {
        if (this.project.people === 1) {
            return "1 person";
        }
        return `${this.project.people} people`;
    }

    constructor(hostId: string, project: Project) {
        super("single-project", hostId, false, project.id.toString())
        this.project = project
        this.configure();
        this.renderContent()
    }

    @AutoBind
    handleDragStart(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this.project.id.toString())
        event.dataTransfer!.effectAllowed = 'move';
    }

    handleDragEnd(_: DragEvent): void {
        console.log("drag end")
    }

    configure() {
        this.element.addEventListener("dragstart", this.handleDragStart)
        this.element.addEventListener("dragend", this.handleDragEnd)
    }
    renderContent() {
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent = this.persons;
        this.element.querySelector("p")!.textContent = this.project.description;
    }
}