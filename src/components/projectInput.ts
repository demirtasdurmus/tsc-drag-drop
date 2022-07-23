import Component from "./baseComponent";
import { Validatable, validate } from "../utils/validation";
import AutoBind from "../decorators/autobind";
import { projectState } from "../state/projectState";


// project input class extending Component
export default class ProjectInput extends Component<HTMLDivElement, HTMLElement> {
    titleEl: HTMLInputElement;
    descriptionEl: HTMLInputElement;
    peopleEl: HTMLInputElement;

    constructor() {
        super("project-input", "app", true, "user-input")

        // reach out the input elements
        this.titleEl = this.element.querySelector("#title") as HTMLInputElement;
        this.descriptionEl = this.element.querySelector("#description") as HTMLInputElement;
        this.peopleEl = this.element.querySelector("#people") as HTMLInputElement;

        // call the attach method to invoke right away
        this.configure();
    }

    configure() {
        this.element.addEventListener("submit", this.submitHandler)
    }

    renderContent(): void { }

    // collect and validate user data
    private collectUSerData(): [string, string, number] | void {
        const title = this.titleEl.value;
        const description = this.descriptionEl.value;
        const people = this.peopleEl.value;

        // create objects for validation and validate
        const titleValidatable: Validatable = {
            value: title,
            required: true
        };
        const descriptionValidatable: Validatable = {
            value: description,
            required: true,
            minLength: 5
        };
        const peopleValidatable: Validatable = {
            value: +people,
            required: true,
            min: 1,
            max: 5
        };
        if (
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ) {
            alert("Invalid input!")
            return;
        } else {
            return [title, description, +people]
        }
    }

    // clear inputs after submit
    private clearInputs() {
        this.titleEl.value = "";
        this.descriptionEl.value = "";
        this.peopleEl.value = "";
    }

    // auto bind submit handler for event listener
    @AutoBind
    private submitHandler(e: Event) {
        e.preventDefault()
        const userData = this.collectUSerData();
        if (Array.isArray(userData)) {
            const [title, description, people] = userData;
            // add the user data to the app state
            projectState.addProject(title, description, people)

            // clear user input fields
            this.clearInputs();
        }
    }
}